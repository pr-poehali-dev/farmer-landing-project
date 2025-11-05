import json
import os
import psycopg2
import jwt
import requests
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: OAuth авторизация через VK
    Args: event - dict с httpMethod, queryStringParameters
          context - object с request_id
    Returns: HTTP redirect на VK или callback с токеном
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET')
    frontend_url = os.environ.get('FRONTEND_URL', 'https://фармер.рф')
    vk_client_id = os.environ.get('VK_CLIENT_ID')
    vk_client_secret = os.environ.get('VK_CLIENT_SECRET')
    
    if not db_url or not jwt_secret:
        return error_response('Не настроены переменные окружения')
    
    if not vk_client_id or not vk_client_secret:
        return error_response('VK не настроен')
    
    params = event.get('queryStringParameters') or {}
    
    if 'code' in params:
        code = params['code']
        function_url = f"https://functions.poehali.dev/{context.function_name if hasattr(context, 'function_name') else ''}"
        
        token_response = requests.get('https://oauth.vk.com/access_token', params={
            'client_id': vk_client_id,
            'client_secret': vk_client_secret,
            'redirect_uri': function_url,
            'code': code
        })
        
        if token_response.status_code != 200:
            return error_response('Ошибка получения токена VK')
        
        token_data = token_response.json()
        access_token = token_data['access_token']
        vk_user_id = token_data['user_id']
        email = token_data.get('email', f'vk_{vk_user_id}@oauth.local')
        
        user_response = requests.get('https://api.vk.com/method/users.get', params={
            'user_ids': vk_user_id,
            'access_token': access_token,
            'v': '5.131'
        })
        
        user_data = user_response.json()['response'][0]
        name = f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip() or 'Пользователь'
        
        token = create_or_login_oauth_user(db_url, jwt_secret, 'vk', str(vk_user_id), email, name)
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': f'{frontend_url}/oauth/callback?token={token}',
                'Access-Control-Allow-Origin': '*'
            },
            'body': ''
        }
    
    else:
        function_url = f"https://functions.poehali.dev/{context.function_name if hasattr(context, 'function_name') else ''}"
        from urllib.parse import urlencode
        auth_params = {
            'client_id': vk_client_id,
            'redirect_uri': function_url,
            'display': 'page',
            'scope': 'email',
            'response_type': 'code',
            'v': '5.131'
        }
        auth_url = f"https://oauth.vk.com/authorize?{urlencode(auth_params)}"
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': auth_url,
                'Access-Control-Allow-Origin': '*'
            },
            'body': ''
        }


def create_or_login_oauth_user(db_url: str, jwt_secret: str, provider: str, provider_id: str, email: str, name: str) -> str:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, email, name, role FROM users WHERE oauth_provider = %s AND oauth_provider_id = %s",
        (provider, provider_id)
    )
    user = cur.fetchone()
    
    if user:
        user_id, email, name, role = user
    else:
        cur.execute(
            "INSERT INTO users (email, name, password_hash, role, oauth_provider, oauth_provider_id, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, role",
            (email, name, '', 'farmer', provider, provider_id, datetime.now())
        )
        user_id, role = cur.fetchone()
        conn.commit()
    
    cur.close()
    conn.close()
    
    token_payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(token_payload, jwt_secret, algorithm='HS256')
    
    return token


def error_response(message: str) -> Dict[str, Any]:
    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message})
    }
