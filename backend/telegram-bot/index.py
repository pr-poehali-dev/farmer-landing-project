"""
Business: Telegram бот для авторизации через команду /start
Args: event с POST запросом от Telegram webhook
Returns: Ответ боту с кнопками выбора роли или ссылкой для входа
"""

import json
import os
import jwt
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {'statusCode': 405, 'body': 'Method not allowed', 'isBase64Encoded': False}
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET')
    frontend_url = os.environ.get('FRONTEND_URL', 'https://farmer-landing-project.poehali.dev')
    telegram_bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    
    if not all([db_url, jwt_secret, telegram_bot_token]):
        return {'statusCode': 500, 'body': 'Missing config', 'isBase64Encoded': False}
    
    try:
        body = json.loads(event.get('body', '{}'))
    except:
        return {'statusCode': 400, 'body': 'Invalid JSON', 'isBase64Encoded': False}
    
    message = body.get('message', {})
    callback_query = body.get('callback_query')
    
    if callback_query:
        handle_callback(callback_query, db_url, jwt_secret, frontend_url, telegram_bot_token)
        return {'statusCode': 200, 'body': 'OK', 'isBase64Encoded': False}
    
    if not message:
        return {'statusCode': 200, 'body': 'OK', 'isBase64Encoded': False}
    
    chat_id = message.get('chat', {}).get('id')
    text = message.get('text', '')
    user = message.get('from', {})
    
    if not chat_id:
        return {'statusCode': 200, 'body': 'OK', 'isBase64Encoded': False}
    
    if text.startswith('/start'):
        send_role_selection(chat_id, telegram_bot_token, user)
    
    return {'statusCode': 200, 'body': 'OK', 'isBase64Encoded': False}

def send_role_selection(chat_id: int, bot_token: str, user: Dict):
    import requests
    
    first_name = user.get('first_name', 'Пользователь')
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '🌱 Фермер', 'callback_data': 'role:farmer'}],
            [{'text': '📈 Инвестор', 'callback_data': 'role:investor'}],
            [{'text': '🛒 Продавец', 'callback_data': 'role:seller'}]
        ]
    }
    
    text = f"Привет, {first_name}! 👋\n\nВыберите свою роль для входа в систему:"
    
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    data = {
        'chat_id': chat_id,
        'text': text,
        'reply_markup': json.dumps(keyboard)
    }
    
    requests.post(url, json=data)

def handle_callback(callback: Dict, db_url: str, jwt_secret: str, frontend_url: str, bot_token: str):
    import requests
    
    callback_id = callback.get('id')
    data = callback.get('data', '')
    user = callback.get('from', {})
    message = callback.get('message', {})
    chat_id = message.get('chat', {}).get('id')
    
    if not data.startswith('role:'):
        return
    
    role = data.split(':')[1]
    
    telegram_id = str(user.get('id'))
    first_name = user.get('first_name', '')
    last_name = user.get('last_name', '')
    username = user.get('username', '')
    
    email = f'telegram_{telegram_id}@oauth.local'
    name = f"{first_name} {last_name}".strip() or username or 'Пользователь'
    
    token = create_or_login_oauth_user(
        db_url, jwt_secret, 'telegram', telegram_id,
        email, name, first_name, last_name, '', role
    )
    
    role_names = {'farmer': 'Фермер', 'investor': 'Инвестор', 'seller': 'Продавец'}
    role_name = role_names.get(role, role)
    
    login_url = f"{frontend_url}/oauth/callback?token={token}&role={role}&provider=telegram"
    
    text = f"✅ Роль: {role_name}\n\nНажмите кнопку ниже для входа:"
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '🔐 Войти на сайт', 'url': login_url}]
        ]
    }
    
    url = f'https://api.telegram.org/bot{bot_token}/answerCallbackQuery'
    requests.post(url, json={'callback_query_id': callback_id, 'text': f'Выбрана роль: {role_name}'})
    
    url = f'https://api.telegram.org/bot{bot_token}/editMessageText'
    data = {
        'chat_id': chat_id,
        'message_id': message.get('message_id'),
        'text': text,
        'reply_markup': json.dumps(keyboard)
    }
    requests.post(url, json=data)

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
            f"UPDATE {schema}.users SET first_name = %s, last_name = %s WHERE id = %s",
            (first_name, last_name, user_id)
        )
        conn.commit()
    else:
        cur.execute(f"SELECT id, role, name FROM {schema}.users WHERE LOWER(email) = %s", (email.lower(),))
        existing = cur.fetchone()
        
        if existing:
            user_id, role, name = existing
            cur.execute(
                f"UPDATE {schema}.users SET oauth_provider = %s, oauth_provider_id = %s, first_name = %s, last_name = %s WHERE id = %s",
                (provider, provider_id, first_name, last_name, user_id)
            )
            conn.commit()
        else:
            cur.execute(
                f"INSERT INTO {schema}.users (email, role, name, first_name, last_name, oauth_provider, oauth_provider_id) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (email, role, name, first_name, last_name, provider, provider_id)
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
