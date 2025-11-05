import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Возвращает публичную конфигурацию OAuth (без секретов)
    Args: event - dict с httpMethod
          context - object с request_id
    Returns: JSON с публичными данными OAuth провайдеров
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    telegram_bot_username = os.environ.get('TELEGRAM_BOT_USERNAME', '')
    yandex_client_id = os.environ.get('YANDEX_CLIENT_ID', '')
    vk_client_id = os.environ.get('VK_CLIENT_ID', '')
    
    config = {
        'telegram': {
            'enabled': bool(telegram_bot_username),
            'bot_username': telegram_bot_username
        },
        'yandex': {
            'enabled': bool(yandex_client_id)
        },
        'vk': {
            'enabled': bool(vk_client_id)
        }
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(config)
    }
