"""
Business: OAuth авторизация через Яндекс ID
Args: event - dict с httpMethod, queryStringParameters (code для callback)
      context - object с request_id
Returns: HTTP response с редиректом или JWT токеном
"""

import json
import os
import jwt
import requests
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any

DATABASE_URL = os.environ.get('DATABASE_URL')
YANDEX_CLIENT_ID = os.environ.get('YANDEX_CLIENT_ID')
YANDEX_CLIENT_SECRET = os.environ.get('YANDEX_CLIENT_SECRET')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://farmer-landing-project.poehali.dev')
JWT_SECRET = os.environ.get('JWT_SECRET')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        code = params.get('code')
        
        if not code:
            redirect_uri = f"{FRONTEND_URL}/oauth/callback?provider=yandex"
            yandex_auth_url = f"https://oauth.yandex.ru/authorize?response_type=code&client_id={YANDEX_CLIENT_ID}&redirect_uri={redirect_uri}"
            
            return {
                'statusCode': 302,
                'headers': {
                    'Location': yandex_auth_url,
                    'Access-Control-Allow-Origin': '*'
                },
                'body': '',
                'isBase64Encoded': False
            }
        
        redirect_uri = f"{FRONTEND_URL}/oauth/callback?provider=yandex"
        token_url = "https://oauth.yandex.ru/token"
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': YANDEX_CLIENT_ID,
            'client_secret': YANDEX_CLIENT_SECRET
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_result = token_response.json()
        
        if 'error' in token_result:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': token_result.get('error_description', 'Yandex auth error')}),
                'isBase64Encoded': False
            }
        
        access_token = token_result.get('access_token')
        
        user_info_url = "https://login.yandex.ru/info"
        headers = {'Authorization': f'OAuth {access_token}'}
        user_info_response = requests.get(user_info_url, headers=headers)
        user_info = user_info_response.json()
        
        if 'id' not in user_info:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Failed to fetch Yandex user info'}),
                'isBase64Encoded': False
            }
        
        yandex_user_id = user_info.get('id')
        email = user_info.get('default_email', f"ya{yandex_user_id}@farmer.local")
        first_name = user_info.get('first_name', '')
        last_name = user_info.get('last_name', '')
        display_name = user_info.get('display_name', f"{first_name} {last_name}").strip()
        avatar_url = user_info.get('default_avatar_id', '')
        if avatar_url:
            avatar_url = f"https://avatars.yandex.net/get-yapic/{avatar_url}/islands-200"
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, role, name FROM t_p53065890_farmer_landing_proje.users 
            WHERE oauth_provider = 'yandex' AND oauth_id = %s
        """, (str(yandex_user_id),))
        
        user = cur.fetchone()
        
        if user:
            user_id, email_db, role, name = user
            cur.execute("""
                UPDATE t_p53065890_farmer_landing_proje.users 
                SET oauth_access_token = %s, avatar_url = %s, email = %s
                WHERE id = %s
            """, (access_token, avatar_url, email, user_id))
        else:
            cur.execute("""
                INSERT INTO t_p53065890_farmer_landing_proje.users 
                (email, name, first_name, last_name, role, oauth_provider, oauth_id, oauth_access_token, avatar_url, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id, email, role, name
            """, (email, display_name, first_name, last_name, 'investor', 'yandex', str(yandex_user_id), access_token, avatar_url))
            
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
        
        redirect_url = f"{FRONTEND_URL}/oauth/callback?provider=yandex&token={jwt_token}&role={role}"
        
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
