'''
Business: AI-powered farm analysis using GigaChat
Args: event with httpMethod, headers (X-User-Id), body with farm data
Returns: Personalized recommendations and analytics
'''

import json
import os
import requests
from typing import Dict, Any, List
from datetime import datetime

def get_access_token() -> str:
    """Get GigaChat access token using client credentials"""
    api_key = os.environ.get('GIGACHAT_API_KEY', '')
    
    response = requests.post(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        headers={
            'Authorization': f'Bearer {api_key}',
            'RqUID': str(datetime.now().timestamp()),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data={'scope': 'GIGACHAT_API_PERS'},
        verify=False
    )
    
    if response.status_code != 200:
        raise Exception(f'Failed to get token: {response.text}')
    
    return response.json()['access_token']

def analyze_with_gigachat(farm_data: Dict[str, Any], access_token: str) -> Dict[str, Any]:
    """Send farm data to GigaChat for analysis"""
    
    # Формируем промпт для анализа
    prompt = f"""Ты — эксперт-консультант по сельскому хозяйству. Проанализируй данные фермерского хозяйства и дай конкретные рекомендации.

ДАННЫЕ ХОЗЯЙСТВА:
Регион: {farm_data.get('region', 'Не указан')}
Земля: {farm_data.get('landArea', 0)} га (в собственности: {farm_data.get('landOwned', 0)} га, аренда: {farm_data.get('landRented', 0)} га)

Животные:
{format_animals(farm_data.get('animals', []))}

Посевы:
{format_crops(farm_data.get('crops', []))}

Техника:
{format_equipment(farm_data.get('equipment', []))}

Сотрудники: {farm_data.get('employeesPermanent', 0)} постоянных, {farm_data.get('employeesSeasonal', 0)} сезонных

ЗАДАНИЕ:
Дай подробный анализ по 5 категориям:
1. ПРОДУКТИВНОСТЬ: оцени эффективность животноводства и растениеводства
2. ТЕХНОЛОГИЧНОСТЬ: оцени состояние техники и оборудования
3. ИНВЕСТИЦИИ: что нужно улучшить в первую очередь
4. РИСКИ: какие угрозы есть для хозяйства
5. РЕКОМЕНДАЦИИ: 3-5 конкретных действий для увеличения прибыли

Отвечай кратко, конкретно, с цифрами. Формат ответа — строгий JSON."""

    response = requests.post(
        'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'GigaChat',
            'messages': [
                {'role': 'system', 'content': 'Ты — эксперт по сельскому хозяйству. Отвечаешь кратко, по делу, с конкретными рекомендациями.'},
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.7,
            'max_tokens': 2000
        },
        verify=False
    )
    
    if response.status_code != 200:
        raise Exception(f'GigaChat API error: {response.text}')
    
    result = response.json()
    ai_response = result['choices'][0]['message']['content']
    
    return {
        'analysis': ai_response,
        'timestamp': datetime.now().isoformat(),
        'model': 'GigaChat'
    }

def format_animals(animals: List[Dict]) -> str:
    """Format animals data for prompt"""
    if not animals:
        return "Нет данных"
    
    lines = []
    for animal in animals:
        animal_type = animal.get('type', '')
        count = animal.get('count', 0)
        
        if animal_type == 'cows':
            direction = animal.get('direction', '')
            breed = animal.get('breed', '')
            milk_yield = animal.get('milkYield', 0)
            milk_price = animal.get('milkPrice', 0)
            lines.append(f"- Коровы ({breed}, {direction}): {count} голов, удой {milk_yield} л/год, цена {milk_price} ₽/л")
        elif animal_type == 'pigs':
            lines.append(f"- Свиньи: {count} голов")
        elif animal_type == 'chickens':
            lines.append(f"- Куры: {count} голов")
        elif animal_type == 'sheep':
            lines.append(f"- Овцы: {count} голов")
        elif animal_type == 'hives':
            lines.append(f"- Ульи: {count} шт")
    
    return "\n".join(lines) if lines else "Нет данных"

def format_crops(crops: List[Dict]) -> str:
    """Format crops data for prompt"""
    if not crops:
        return "Нет данных"
    
    lines = []
    for crop in crops:
        name = crop.get('name', 'Неизвестная культура')
        area = crop.get('area', 0)
        crop_yield = crop.get('yield', 0)
        price = crop.get('pricePerKg', 0)
        lines.append(f"- {name}: {area} га, урожайность {crop_yield} ц/га, цена {price} ₽/кг")
    
    return "\n".join(lines) if lines else "Нет данных"

def format_equipment(equipment: List[Dict]) -> str:
    """Format equipment data for prompt"""
    if not equipment:
        return "Нет данных"
    
    lines = []
    current_year = datetime.now().year
    
    for item in equipment:
        name = item.get('name', 'Техника')
        year = item.get('year', current_year)
        age = current_year - year
        lines.append(f"- {name} ({year} год, возраст {age} лет)")
    
    return "\n".join(lines) if lines else "Нет данных"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing X-User-Id header'})
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
    
    # Parse farm data
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    
    body_data = json.loads(body_str)
    farm_data = body_data.get('farmData', {})
    
    if not farm_data:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Farm data is required'})
        }
    
    # Get access token and analyze
    access_token = get_access_token()
    analysis_result = analyze_with_gigachat(farm_data, access_token)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(analysis_result, ensure_ascii=False)
    }