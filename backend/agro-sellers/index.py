import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления данными продавцов сельхозтоваров
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными продавцов
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            seller_id = event.get('queryStringParameters', {}).get('id')
            if seller_id:
                cur.execute("SELECT * FROM agro_sellers WHERE id = %s", (seller_id,))
                result = cur.fetchone()
            else:
                cur.execute("SELECT * FROM agro_sellers ORDER BY created_at DESC")
                result = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cur.execute(
                """INSERT INTO agro_sellers (company_name, payment_for_analytics, interested_in_contacts, 
                   contact_person, contact_phone, contact_email, description)
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (data['company_name'], data['payment_for_analytics'], data.get('interested_in_contacts', True),
                 data.get('contact_person'), data.get('contact_phone'), data.get('contact_email'), data.get('description'))
            )
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            cur.execute(
                """UPDATE agro_sellers 
                   SET company_name=%s, payment_for_analytics=%s, interested_in_contacts=%s,
                       contact_person=%s, contact_phone=%s, contact_email=%s, description=%s
                   WHERE id=%s RETURNING *""",
                (data['company_name'], data['payment_for_analytics'], data.get('interested_in_contacts', True),
                 data.get('contact_person'), data.get('contact_phone'), data.get('contact_email'), 
                 data.get('description'), data['id'])
            )
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'DELETE':
            seller_id = event.get('queryStringParameters', {}).get('id')
            cur.execute("DELETE FROM agro_sellers WHERE id = %s", (seller_id,))
            conn.commit()
            
            return {
                'statusCode': 204,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': ''
            }
    
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
