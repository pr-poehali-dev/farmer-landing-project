"""
Business: OAuth авторизация через ВКонтакте
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
VK_CLIENT_ID = os.environ.get('VK_CLIENT_ID')
VK_CLIENT_SECRET = os.environ.get('VK_CLIENT_SECRET')
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
            redirect_uri = f"{FRONTEND_URL}/oauth/callback?provider=vk"
            vk_auth_url = f"https://oauth.vk.com/authorize?client_id={VK_CLIENT_ID}&redirect_uri={redirect_uri}&display=page&scope=email&response_type=code&v=5.131"
            
            return {
                'statusCode': 302,
                'headers': {
                    'Location': vk_auth_url,
                    'Access-Control-Allow-Origin': '*'
                },
                'body': '',
                'isBase64Encoded': False
            }
        
        redirect_uri = f"{FRONTEND_URL}/oauth/callback?provider=vk"
        token_url = "https://oauth.vk.com/access_token"
        token_params = {
            'client_id': VK_CLIENT_ID,
            'client_secret': VK_CLIENT_SECRET,
            'redirect_uri': redirect_uri,
            'code': code
        }
        
        token_response = requests.get(token_url, params=token_params)
        token_data = token_response.json()
        
        if 'error' in token_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': token_data.get('error_description', 'VK auth error')}),
                'isBase64Encoded': False
            }
        
        access_token = token_data.get('access_token')
        vk_user_id = token_data.get('user_id')
        vk_email = token_data.get('email')
        
        user_info_url = f"https://api.vk.com/method/users.get?user_ids={vk_user_id}&fields=photo_200&access_token={access_token}&v=5.131"
        user_info_response = requests.get(user_info_url)
        user_info = user_info_response.json()
        
        if 'response' not in user_info or not user_info['response']:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Failed to fetch VK user info'}),
                'isBase64Encoded': False
            }
        
        vk_user = user_info['response'][0]
        first_name = vk_user.get('first_name', '')
        last_name = vk_user.get('last_name', '')
        photo_url = vk_user.get('photo_200', '')
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, role, name FROM t_p53065890_farmer_landing_proje.users 
            WHERE oauth_provider = 'vk' AND oauth_id = %s
        """, (str(vk_user_id),))
        
        user = cur.fetchone()
        
        if user:
            user_id, email, role, name = user
            cur.execute("""
                UPDATE t_p53065890_farmer_landing_proje.users 
                SET oauth_access_token = %s, avatar_url = %s 
                WHERE id = %s
            """, (access_token, photo_url, user_id))
        else:
            email_to_use = vk_email or f"vk{vk_user_id}@farmer.local"
            name_to_use = f"{first_name} {last_name}".strip()
            
            cur.execute("""
                INSERT INTO t_p53065890_farmer_landing_proje.users 
                (email, name, first_name, last_name, role, oauth_provider, oauth_id, oauth_access_token, avatar_url, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id, email, role, name
            """, (email_to_use, name_to_use, first_name, last_name, 'investor', 'vk', str(vk_user_id), access_token, photo_url))
            
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
        
        redirect_url = f"{FRONTEND_URL}/oauth/callback?provider=vk&token={jwt_token}&role={role}"
        
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
