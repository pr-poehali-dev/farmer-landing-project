import json
import os
import uuid
import requests
from typing import Dict, Any, List

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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: API endpoint для чата с GigaChat - получает сообщения пользователя и возвращает ответы ИИ
    Args: event - dict с httpMethod, body (messages: история чата)
          context - объект с request_id, function_name и другими атрибутами
    Returns: HTTP response с ответом от GigaChat
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    api_key = os.environ.get('GIGACHAT_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'GIGACHAT_API_KEY not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    messages = body_data.get('messages', [])
    
    if not messages:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Messages array is required'})
        }
    
    system_prompt = {
        'role': 'system',
        'content': 'Ты - опытный агроном и консультант по сельскому хозяйству. Помогай фермерам с вопросами по растениеводству, животноводству, экономике хозяйства. Давай конкретные практические советы с расчетами. Отвечай кратко и по делу на русском языке.'
    }
    
    full_messages = [system_prompt] + messages
    
    access_token = get_gigachat_token(api_key)
    response_text = chat_with_gigachat(access_token, full_messages)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'response': response_text,
            'request_id': context.request_id
        })
    }
