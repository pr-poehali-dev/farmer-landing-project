import json
import os
import hashlib
import hmac
import time
import jwt
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Обработка Telegram Login Widget callback
    Args: event с httpMethod, queryStringParameters (id, first_name, last_name, username, photo_url, auth_date, hash)
    Returns: Редирект на фронтенд с JWT токеном
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    params = event.get('queryStringParameters') or {}
    role = params.get('role', 'farmer')
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET')
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    telegram_bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    
    if not db_url or not jwt_secret or not telegram_bot_token:
        return error_redirect(frontend_url, 'Не настроены переменные окружения')
    
    telegram_id = params.get('id')
    first_name = params.get('first_name', '')
    last_name = params.get('last_name', '')
    username = params.get('username', '')
    photo_url = params.get('photo_url', '')
    auth_date = params.get('auth_date')
    received_hash = params.get('hash')
    
    if not telegram_id or not auth_date or not received_hash:
        return error_redirect(frontend_url, 'Неполные данные от Telegram')
    
    if not verify_telegram_auth(params, telegram_bot_token):
        return error_redirect(frontend_url, 'Неверная подпись Telegram')
    
    email = f'telegram_{telegram_id}@oauth.local'
    name = f"{first_name} {last_name}".strip() or username or 'Пользователь'
    
    token = create_or_login_oauth_user(
        db_url, jwt_secret, 'telegram', telegram_id, 
        email, name, first_name, last_name, photo_url, role
    )
    
    return {
        'statusCode': 302,
        'headers': {
            'Location': f'{frontend_url}/oauth/callback?token={token}',
            'Access-Control-Allow-Origin': '*'
        },
        'body': '',
        'isBase64Encoded': False
    }

def verify_telegram_auth(params: Dict[str, str], bot_token: str) -> bool:
    received_hash = params.get('hash')
    auth_date = params.get('auth_date')
    
    if int(time.time()) - int(auth_date) > 86400:
        return False
    
    data_check_arr = []
    for key in sorted(params.keys()):
        if key != 'hash':
            data_check_arr.append(f"{key}={params[key]}")
    
    data_check_string = '\n'.join(data_check_arr)
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    return calculated_hash == received_hash

def create_or_login_oauth_user(
    db_url: str, jwt_secret: str, provider: str, provider_id: str, 
    email: str, name: str, first_name: str = '', last_name: str = '', photo_url: str = '', role: str = 'farmer'
) -> str:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    schema = 't_p53065890_farmer_landing_proje'
    
    cur.execute(
        f"SELECT id, email, role, name FROM {schema}.users WHERE oauth_provider = %s AND oauth_provider_id = %s", 
        (provider, provider_id)
    )
    user = cur.fetchone()
    
    if user:
        user_id, email, role, name = user
        cur.execute(
            f"UPDATE {schema}.users SET first_name = %s, last_name = %s, photo_url = %s WHERE id = %s",
            (first_name, last_name, photo_url, user_id)
        )
        conn.commit()
    else:
        cur.execute(f"SELECT id, role, name FROM {schema}.users WHERE LOWER(email) = %s", (email.lower(),))
        existing = cur.fetchone()
        
        if existing:
            user_id, role, name = existing
            cur.execute(
                f"UPDATE {schema}.users SET oauth_provider = %s, oauth_provider_id = %s, first_name = %s, last_name = %s, photo_url = %s WHERE id = %s",
                (provider, provider_id, first_name, last_name, photo_url, user_id)
            )
            conn.commit()
        else:
            cur.execute(
                f"INSERT INTO {schema}.users (email, role, name, first_name, last_name, photo_url, oauth_provider, oauth_provider_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (email, role, name, first_name, last_name, photo_url, provider, provider_id)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
    
    conn.close()
    
    token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, jwt_secret, algorithm='HS256')
    
    return token

def error_redirect(frontend_url: str, message: str) -> Dict[str, Any]:
    return {
        'statusCode': 302,
        'headers': {
            'Location': f'{frontend_url}/login?error={message}',
            'Access-Control-Allow-Origin': '*'
        },
        'body': '',
        'isBase64Encoded': False
    }