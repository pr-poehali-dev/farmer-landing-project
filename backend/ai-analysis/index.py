import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Analyze farm data using GigaChat AI and provide recommendations
    Args: event with httpMethod, body (farmData), headers (X-User-Id)
          context with request_id, function_name attributes
    Returns: HTTP response with AI analysis and recommendations
    '''
    method: str = event.get('httpMethod', 'POST')
    
    # Handle CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
    
    # Parse request
    body_data = json.loads(event.get('body', '{}'))
    farm_data = body_data.get('farmData', {})
    
    # Get GigaChat credentials
    gigachat_key = os.environ.get('GIGACHAT_API_KEY', '')
    
    if not gigachat_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'GigaChat API key not configured'})
        }
    
    # Prepare analysis prompt
    prompt = f"""Ты — эксперт по сельскому хозяйству. Проанализируй данные фермерского хозяйства и дай конкретные рекомендации.

Данные хозяйства:
- Регион: {farm_data.get('region', 'Не указан')}
- Площадь земли: {farm_data.get('landArea', 0)} га (в собственности: {farm_data.get('landOwned', 0)} га, в аренде: {farm_data.get('landRented', 0)} га)
- Животные: {json.dumps(farm_data.get('animals', []), ensure_ascii=False)}
- Посевы: {json.dumps(farm_data.get('crops', []), ensure_ascii=False)}
- Техника: {json.dumps(farm_data.get('equipment', []), ensure_ascii=False)}
- Постоянных сотрудников: {farm_data.get('employeesPermanent', 0)}
- Сезонных сотрудников: {farm_data.get('employeesSeasonal', 0)}

Дай анализ по следующим категориям:

**📊 Продуктивность**
[Оцени текущую продуктивность и загрузку ресурсов]

**🔧 Технологичность**
[Оцени уровень технического оснащения]

**💰 Инвестиционный потенциал**
[Куда выгодно вложить средства для роста прибыли]

**⚠️ Риски**
[Главные риски и уязвимости хозяйства]

**✅ Рекомендуемые действия**
[3-5 конкретных шагов для увеличения прибыли]

Отвечай кратко, по делу, с конкретными цифрами и примерами."""

    try:
        # Get GigaChat access token
        auth_response = requests.post(
            'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            headers={
                'Authorization': f'Bearer {gigachat_key}',
                'RqUID': context.request_id,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data={'scope': 'GIGACHAT_API_PERS'},
            verify=False,
            timeout=10
        )
        
        if auth_response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Failed to authenticate with GigaChat'})
            }
        
        access_token = auth_response.json().get('access_token')
        
        # Call GigaChat API
        chat_response = requests.post(
            'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'GigaChat',
                'messages': [
                    {'role': 'system', 'content': 'Ты — эксперт по агробизнесу и консультант фермеров.'},
                    {'role': 'user', 'content': prompt}
                ],
                'temperature': 0.7,
                'max_tokens': 2000
            },
            verify=False,
            timeout=30
        )
        
        if chat_response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'GigaChat API error'})
            }
        
        analysis = chat_response.json()['choices'][0]['message']['content']
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'analysis': analysis})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
