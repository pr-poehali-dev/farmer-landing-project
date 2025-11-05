import json
import os
import psycopg2
import jwt
import requests
from datetime import datetime, timedelta
from typing import Dict, Any
from urllib.parse import urlencode

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: OAuth авторизация через Telegram, Яндекс, VK
    Args: event - dict с httpMethod, queryStringParameters, pathParams
          context - object с request_id
    Returns: HTTP redirect или JSON с токеном
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
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    
    telegram_bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    yandex_client_id = os.environ.get('YANDEX_CLIENT_ID')
    yandex_client_secret = os.environ.get('YANDEX_CLIENT_SECRET')
    vk_client_id = os.environ.get('VK_CLIENT_ID')
    vk_client_secret = os.environ.get('VK_CLIENT_SECRET')
    
    if not db_url or not jwt_secret:
        return error_response('Не настроены переменные окружения')
    
    params = event.get('queryStringParameters') or {}
    
    # Определяем провайдера из query параметров
    provider = params.get('provider')
    
    if not provider or provider not in ['telegram', 'yandex', 'vk']:
        return error_response('Неизвестный провайдер. Используйте ?provider=telegram|yandex|vk')
    
    # === TELEGRAM ===
    if provider == 'telegram':
        if not telegram_bot_token:
            return error_response('Telegram не настроен')
        
        # Telegram использует Telegram Login Widget
        # Пользователь перенаправляется на специальную страницу с виджетом
        telegram_auth_url = f"{frontend_url}/oauth/telegram"
        
        return {
            'statusCode': 302,
            'headers': {
                'Location': telegram_auth_url,
                'Access-Control-Allow-Origin': '*'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # === ЯНДЕКС ID ===
    elif provider == 'yandex':
        if not yandex_client_id or not yandex_client_secret:
            return error_response('Яндекс ID не настроен')
        
        # Callback с кодом авторизации
        if 'code' in params:
            code = params['code']
            
            # Обмен кода на токен
            token_response = requests.post('https://oauth.yandex.ru/token', data={
                'grant_type': 'authorization_code',
                'code': code,
                'client_id': yandex_client_id,
                'client_secret': yandex_client_secret
            })
            
            if token_response.status_code != 200:
                return error_response('Ошибка получения токена Яндекс')
            
            access_token = token_response.json()['access_token']
            
            # Получение данных пользователя
            user_response = requests.get('https://login.yandex.ru/info', headers={
                'Authorization': f'OAuth {access_token}'
            })
            
            if user_response.status_code != 200:
                return error_response('Ошибка получения данных пользователя')
            
            user_data = user_response.json()
            yandex_id = user_data['id']
            email = user_data.get('default_email', f'yandex_{yandex_id}@oauth.local')
            first_name = user_data.get('first_name', '')
            last_name = user_data.get('last_name', '')
            name = user_data.get('display_name', user_data.get('real_name', 'Пользователь'))
            photo_url = ''
            if 'default_avatar_id' in user_data and user_data['default_avatar_id']:
                photo_url = f"https://avatars.yandex.net/get-yapic/{user_data['default_avatar_id']}/islands-200"
            
            # Создание/вход пользователя
            token = create_or_login_oauth_user(db_url, jwt_secret, 'yandex', yandex_id, email, name, first_name, last_name, photo_url)
            
            # Редирект на фронтенд с токеном
            return {
                'statusCode': 302,
                'headers': {
                    'Location': f'{frontend_url}/oauth/callback?token={token}',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': '',
                'isBase64Encoded': False
            }
        
        # Первичный редирект на Яндекс
        else:
            function_url = f"https://functions.poehali.dev/{context.function_name if hasattr(context, 'function_name') else '7b39755d-a7c6-4546-9f5a-4d3ec725a791'}"
            callback_url = f"{function_url}?provider=yandex"
            auth_params = {
                'response_type': 'code',
                'client_id': yandex_client_id,
                'redirect_uri': callback_url
            }
            auth_url = f"https://oauth.yandex.ru/authorize?{urlencode(auth_params)}"
            
            return {
                'statusCode': 302,
                'headers': {
                    'Location': auth_url,
                    'Access-Control-Allow-Origin': '*'
                },
                'body': '',
                'isBase64Encoded': False
            }
    
    # === VK ===
    elif provider == 'vk':
        if not vk_client_id or not vk_client_secret:
            return error_response('VK не настроен')
        
        # Callback с кодом авторизации
        if 'code' in params:
            code = params['code']
            function_url = f"https://functions.poehali.dev/{context.function_name if hasattr(context, 'function_name') else '7b39755d-a7c6-4546-9f5a-4d3ec725a791'}"
            callback_url = f"{function_url}?provider=vk"
            
            # Обмен кода на токен
            token_response = requests.get('https://oauth.vk.com/access_token', params={
                'client_id': vk_client_id,
                'client_secret': vk_client_secret,
                'redirect_uri': callback_url,
                'code': code
            })
            
            if token_response.status_code != 200:
                return error_response('Ошибка получения токена VK')
            
            token_data = token_response.json()
            access_token = token_data['access_token']
            vk_user_id = token_data['user_id']
            email = token_data.get('email', f'vk_{vk_user_id}@oauth.local')
            
            # Получение данных пользователя
            user_response = requests.get('https://api.vk.com/method/users.get', params={
                'user_ids': vk_user_id,
                'access_token': access_token,
                'v': '5.131'
            })
            
            user_data = user_response.json()['response'][0]
            first_name = user_data.get('first_name', '')
            last_name = user_data.get('last_name', '')
            name = f"{first_name} {last_name}".strip() or 'Пользователь'
            photo_url = user_data.get('photo_200', '')
            
            # Создание/вход пользователя
            token = create_or_login_oauth_user(db_url, jwt_secret, 'vk', str(vk_user_id), email, name, first_name, last_name, photo_url)
            
            # Редирект на фронтенд с токеном
            return {
                'statusCode': 302,
                'headers': {
                    'Location': f'{frontend_url}/oauth/callback?token={token}',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': '',
                'isBase64Encoded': False
            }
        
        # Первичный редирект на VK
        else:
            function_url = f"https://functions.poehali.dev/{context.function_name if hasattr(context, 'function_name') else '7b39755d-a7c6-4546-9f5a-4d3ec725a791'}"
            callback_url = f"{function_url}?provider=vk"
            auth_params = {
                'client_id': vk_client_id,
                'redirect_uri': callback_url,
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
                'body': '',
                'isBase64Encoded': False
            }
    
    return error_response('Неизвестный провайдер')


def create_or_login_oauth_user(db_url: str, jwt_secret: str, provider: str, provider_id: str, email: str, name: str, first_name: str = '', last_name: str = '', photo_url: str = '') -> str:
    '''Создает или авторизует пользователя через OAuth'''
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    schema = 't_p53065890_farmer_landing_proje'
    
    # Проверяем, есть ли пользователь с таким provider_id
    cur.execute(f"SELECT id, email, role, name FROM {schema}.users WHERE oauth_provider = %s AND oauth_provider_id = %s", 
                (provider, provider_id))
    user = cur.fetchone()
    
    if user:
        # Пользователь уже существует - обновляем его данные
        user_id, email, role, name = user
        cur.execute(
            f"UPDATE {schema}.users SET first_name = %s, last_name = %s, photo_url = %s WHERE id = %s",
            (first_name, last_name, photo_url, user_id)
        )
        conn.commit()
    else:
        # Проверяем email
        cur.execute(f"SELECT id, role, name FROM {schema}.users WHERE LOWER(email) = %s", (email.lower(),))
        existing = cur.fetchone()
        
        if existing:
            # Email уже занят, привязываем OAuth и обновляем данные
            user_id, role, name = existing
            cur.execute(
                f"UPDATE {schema}.users SET oauth_provider = %s, oauth_provider_id = %s, first_name = %s, last_name = %s, photo_url = %s WHERE id = %s",
                (provider, provider_id, first_name, last_name, photo_url, user_id)
            )
            conn.commit()
        else:
            # Создаем нового пользователя
            role = 'farmer'  # По умолчанию farmer
            cur.execute(
                f"INSERT INTO {schema}.users (email, role, name, first_name, last_name, photo_url, oauth_provider, oauth_provider_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (email, role, name, first_name, last_name, photo_url, provider, provider_id)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
    
    conn.close()
    
    # Генерируем JWT токен
    token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, jwt_secret, algorithm='HS256')
    
    return token


def error_response(message: str) -> Dict[str, Any]:
    '''Возвращает ошибку'''
    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }