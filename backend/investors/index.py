import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления данными инвесторов
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными инвесторов
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
            investor_id = event.get('queryStringParameters', {}).get('id')
            if investor_id:
                cur.execute("SELECT * FROM investors WHERE id = %s", (investor_id,))
                result = cur.fetchone()
            else:
                cur.execute("SELECT * FROM investors ORDER BY created_at DESC")
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
                """INSERT INTO investors (name, investment_amount, desired_return_type, contact_phone, contact_email, additional_notes)
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING *""",
                (data['name'], data['investment_amount'], data['desired_return_type'],
                 data.get('contact_phone'), data.get('contact_email'), data.get('additional_notes'))
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
                """UPDATE investors 
                   SET name=%s, investment_amount=%s, desired_return_type=%s, 
                       contact_phone=%s, contact_email=%s, additional_notes=%s
                   WHERE id=%s RETURNING *""",
                (data['name'], data['investment_amount'], data['desired_return_type'],
                 data.get('contact_phone'), data.get('contact_email'), data.get('additional_notes'), data['id'])
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
            investor_id = event.get('queryStringParameters', {}).get('id')
            cur.execute("DELETE FROM investors WHERE id = %s", (investor_id,))
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
