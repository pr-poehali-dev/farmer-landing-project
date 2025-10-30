'''
Business: Принимает заявки с сайта (фермеры, инвесторы, продавцы) и сохраняет в БД
Args: event - dict с httpMethod, body; context - объект с request_id
Returns: HTTP response dict
'''
import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    name: str = body_data.get('name', '')
    email: str = body_data.get('email', '')
    phone: Optional[str] = body_data.get('phone')
    user_type: str = body_data.get('type', 'farmer')
    company_name: Optional[str] = body_data.get('company_name')
    interest_type: Optional[str] = body_data.get('interest_type')
    message: Optional[str] = body_data.get('message')
    rating: Optional[int] = body_data.get('rating')
    suggestions: Optional[str] = body_data.get('suggestions')
    region: Optional[str] = body_data.get('region')
    
    if not name or not email or not user_type:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Name, email and type are required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if user_type == 'farmer':
        cur.execute(
            "INSERT INTO farmer_leads (name, email, phone, company_name, region) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, email, phone, company_name, region)
        )
    elif user_type == 'investor':
        cur.execute(
            "INSERT INTO investor_leads (name, email, phone, interest_type, region) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, email, phone, interest_type, region)
        )
    elif user_type == 'seller':
        cur.execute(
            "INSERT INTO seller_leads (company_name, email, phone, message, region) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (company_name, email, phone, message, region)
        )
    else:
        cur.execute(
            "INSERT INTO leads (name, email, phone, user_type, company_name, interest_type, message, rating, suggestions, region) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (name, email, phone, user_type, company_name, interest_type, message, rating, suggestions, region)
        )
    
    result = cur.fetchone()
    lead_id = result['id'] if result else None
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'id': lead_id,
            'message': 'Заявка успешно отправлена'
        })
    }