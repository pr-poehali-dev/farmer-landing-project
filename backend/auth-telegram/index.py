"""
Business: Авторизация через Telegram Widget
Args: event - dict с httpMethod, queryStringParameters (данные от Telegram)
      context - object с request_id
Returns: HTTP response с JWT токеном
"""

import json
import os
import jwt
import hashlib
import hmac
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any

DATABASE_URL = os.environ.get('DATABASE_URL')
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://farmer-landing-project.poehali.dev')
JWT_SECRET = os.environ.get('JWT_SECRET')

def verify_telegram_auth(auth_data: Dict[str, str]) -> bool:
    check_hash = auth_data.get('hash')
    if not check_hash:
        return False
    
    data_check_arr = []
    for key, value in sorted(auth_data.items()):
        if key != 'hash':
            data_check_arr.append(f"{key}={value}")
    
    data_check_string = '\n'.join(data_check_arr)
    
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    hash_value = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    return hash_value == check_hash

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET' or method == 'POST':
        params = event.get('queryStringParameters', {})
        
        if not params.get('id'):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No Telegram auth data provided'}),
                'isBase64Encoded': False
            }
        
        if not verify_telegram_auth(params):
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid Telegram auth data'}),
                'isBase64Encoded': False
            }
        
        telegram_id = params.get('id')
        first_name = params.get('first_name', '')
        last_name = params.get('last_name', '')
        username = params.get('username', '')
        photo_url = params.get('photo_url', '')
        
        display_name = f"{first_name} {last_name}".strip() or username
        email = f"tg{telegram_id}@farmer.local"
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, role, name FROM t_p53065890_farmer_landing_proje.users 
            WHERE oauth_provider = 'telegram' AND oauth_id = %s
        """, (str(telegram_id),))
        
        user = cur.fetchone()
        
        if user:
            user_id, email_db, role, name = user
            cur.execute("""
                UPDATE t_p53065890_farmer_landing_proje.users 
                SET avatar_url = %s, first_name = %s, last_name = %s, name = %s
                WHERE id = %s
            """, (photo_url, first_name, last_name, display_name, user_id))
        else:
            cur.execute("""
                INSERT INTO t_p53065890_farmer_landing_proje.users 
                (email, name, first_name, last_name, role, oauth_provider, oauth_id, avatar_url, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id, email, role, name
            """, (email, display_name, first_name, last_name, 'investor', 'telegram', str(telegram_id), photo_url))
            
            user = cur.fetchone()
            user_id, email, role, name = user
        
        conn.commit()
        cur.close()
        conn.close()
        
        jwt_token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'role': role,
            'exp': datetime.utcnow() + timedelta(days=30)
        }, JWT_SECRET, algorithm='HS256')
        
        redirect_url = f"{FRONTEND_URL}/oauth/callback?provider=telegram&token={jwt_token}&role={role}"
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': redirect_url,
                'Access-Control-Allow-Origin': '*'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
