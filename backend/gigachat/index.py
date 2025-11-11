import json
import os
import uuid
import requests
from typing import Dict, Any, List
from datetime import date

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("WARNING: psycopg2 not available, usage tracking disabled")
from datetime import date

def get_gigachat_token(api_key: str) -> str:
    """
    Business: Получить OAuth токен для GigaChat API
    Args: api_key - ключ авторизации GigaChat
    Returns: access_token для запросов к API
    """
    url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': str(uuid.uuid4()),
        'Authorization': f'Basic {api_key}'
    }
    payload = {'scope': 'GIGACHAT_API_PERS'}
    
    response = requests.post(url, headers=headers, data=payload, verify=False)
    response.raise_for_status()
    return response.json()['access_token']

def chat_with_gigachat(access_token: str, messages: List[Dict[str, str]], model: str = 'GigaChat') -> str:
    """
    Business: Отправить сообщение в GigaChat и получить ответ
    Args: access_token - OAuth токен, messages - история сообщений, model - модель GigaChat
    Returns: текст ответа от GigaChat
    """
    url = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    payload = {
        'model': model,
        'messages': messages,
        'temperature': 0.7,
        'max_tokens': 2000
    }
    
    response = requests.post(url, headers=headers, json=payload, verify=False)
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']

def check_usage_limit(user_id: str, dsn: str) -> Dict[str, Any]:
    """
    Business: Перевірка ліміту запитів користувача на поточний день
    Args: user_id - ID користувача, dsn - підключення до БД
    Returns: dict з інформацією про ліміт (allowed: bool, used: int, limit: int, tier: str)
    """
    if not DB_AVAILABLE:
        return {
            'allowed': True,
            'used': 0,
            'limit': 999,
            'tier': 'free',
            'remaining': 999
        }
    
    schema = 't_p53065890_farmer_landing_proje'
    conn = psycopg2.connect(dsn)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            today = date.today()
            
            # Отримуємо підписку користувача
            cur.execute(f'''
                SELECT tier FROM {schema}.user_subscriptions 
                WHERE user_id = %s
            ''', (str(user_id),))
            sub = cur.fetchone()
            tier = sub['tier'] if sub else 'free'
            
            # Отримуємо ліміт для тарифу
            cur.execute(f'''
                SELECT daily_limit FROM {schema}.subscription_plans 
                WHERE tier = %s
            ''', (tier,))
            plan = cur.fetchone()
            daily_limit = plan['daily_limit'] if plan else 3
            
            # Отримуємо кількість запитів сьогодні
            cur.execute(f'''
                SELECT request_count FROM {schema}.gigachat_usage 
                WHERE user_id = %s AND request_date = %s
            ''', (str(user_id), today))
            usage = cur.fetchone()
            used_today = usage['request_count'] if usage else 0
            
            conn.close()
            
            return {
                'allowed': used_today < daily_limit,
                'used': used_today,
                'limit': daily_limit,
                'tier': tier,
                'remaining': max(0, daily_limit - used_today)
            }
    except Exception as e:
        conn.close()
        return {
            'allowed': False,
            'used': 0,
            'limit': 3,
            'tier': 'free',
            'remaining': 0,
            'error': str(e)
        }

def increment_usage(user_id: str, dsn: str) -> None:
    """
    Business: Збільшити лічильник запитів користувача на 1
    Args: user_id - ID користувача, dsn - підключення до БД
    Returns: None
    """
    if not DB_AVAILABLE:
        return
    
    schema = 't_p53065890_farmer_landing_proje'
    conn = psycopg2.connect(dsn)
    
    try:
        with conn.cursor() as cur:
            today = date.today()
            
            # Отримуємо підписку (якщо немає - створюємо free)
            cur.execute(f'''
                INSERT INTO {schema}.user_subscriptions (user_id, tier)
                VALUES (%s, 'free')
                ON CONFLICT (user_id) DO NOTHING
            ''', (str(user_id),))
            
            # Збільшуємо лічильник або створюємо запис
            cur.execute(f'''
                INSERT INTO {schema}.gigachat_usage (user_id, request_date, request_count)
                VALUES (%s, %s, 1)
                ON CONFLICT (user_id, request_date) 
                DO UPDATE SET 
                    request_count = {schema}.gigachat_usage.request_count + 1,
                    updated_at = CURRENT_TIMESTAMP
            ''', (str(user_id), today))
            
            conn.commit()
    finally:
        conn.close()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: API endpoint для чата с GigaChat - получает сообщения пользователя и возвращает ответы ИИ с учетом лимитов по тарифам
    Args: event - dict с httpMethod, body (messages: история чата), headers (X-User-Id)
          context - объект с request_id, function_name и другими атрибутами
    Returns: HTTP response с ответом от GigaChat или ошибкой превышения лимита
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers_resp = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    # GET запит для перевірки лімітів
    if method == 'GET':
        user_id = event.get('headers', {}).get('X-User-Id') or event.get('headers', {}).get('x-user-id')
        if not user_id:
            return {
                'statusCode': 401,
                'headers': headers_resp,
                'body': json.dumps({'error': 'X-User-Id header required'})
            }
        
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            return {
                'statusCode': 500,
                'headers': headers_resp,
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        usage_info = check_usage_limit(user_id, dsn)
        return {
            'statusCode': 200,
            'headers': headers_resp,
            'body': json.dumps(usage_info)
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers_resp,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Перевіряємо авторизацію
    user_id = event.get('headers', {}).get('X-User-Id') or event.get('headers', {}).get('x-user-id')
    if not user_id:
        return {
            'statusCode': 401,
            'headers': headers_resp,
            'body': json.dumps({'error': 'X-User-Id header required'})
        }
    
    # Перевіряємо ліміт запитів
    dsn = os.environ.get('DATABASE_URL')
    if dsn:
        usage_info = check_usage_limit(user_id, dsn)
        if not usage_info['allowed']:
            return {
                'statusCode': 429,
                'headers': headers_resp,
                'body': json.dumps({
                    'error': 'Daily request limit exceeded',
                    'message': f'Превышен лимит запросов ({usage_info["limit"]} в день для тарифа "{usage_info["tier"]}"). Обновите подписку для увеличения лимита.',
                    'usage': usage_info
                })
            }
    
    api_key = os.environ.get('GIGACHAT_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': headers_resp,
            'body': json.dumps({'error': 'GIGACHAT_API_KEY not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    messages = body_data.get('messages', [])
    
    if not messages:
        return {
            'statusCode': 400,
            'headers': headers_resp,
            'body': json.dumps({'error': 'Messages array is required'})
        }
    
    system_prompt = {
        'role': 'system',
        'content': 'Ты - опытный агроном и консультант по сельскому хозяйству. Помогай фермерам с вопросами по растениеводству, животноводству, экономике хозяйства. Давай конкретные практические советы с расчетами. Отвечай кратко и по делу на русском языке.'
    }
    
    full_messages = [system_prompt] + messages
    
    try:
        access_token = get_gigachat_token(api_key)
        response_text = chat_with_gigachat(access_token, full_messages)
        
        # Збільшуємо лічильник успішних запитів
        if dsn:
            increment_usage(user_id, dsn)
            usage_info = check_usage_limit(user_id, dsn)
        else:
            usage_info = {'used': 0, 'limit': 3, 'remaining': 3, 'tier': 'free'}
        
        return {
            'statusCode': 200,
            'headers': headers_resp,
            'isBase64Encoded': False,
            'body': json.dumps({
                'response': response_text,
                'request_id': context.request_id,
                'usage': usage_info
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers_resp,
            'body': json.dumps({
                'error': 'GigaChat API error',
                'message': str(e)
            })
        }