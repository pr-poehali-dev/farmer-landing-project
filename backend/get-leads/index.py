'''
Business: Получает все заявки из базы данных (фермеры, инвесторы, продавцы, опросы)
Args: event - dict с httpMethod, queryStringParameters; context - объект с request_id
Returns: HTTP response dict со списком заявок
'''
import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    lead_type: str = params.get('type', 'all')
    
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
    
    results: Dict[str, List[Dict]] = {}
    
    if lead_type == 'all' or lead_type == 'farmer':
        cur.execute("SELECT id, name, email, phone, company_name, region, created_at FROM farmer_leads ORDER BY created_at DESC")
        results['farmers'] = [dict(row) for row in cur.fetchall()]
    
    if lead_type == 'all' or lead_type == 'investor':
        cur.execute("SELECT id, name, email, phone, interest_type, region, created_at FROM investor_leads ORDER BY created_at DESC")
        results['investors'] = [dict(row) for row in cur.fetchall()]
    
    if lead_type == 'all' or lead_type == 'seller':
        cur.execute("SELECT id, company_name, email, phone, message, region, created_at FROM seller_leads ORDER BY created_at DESC")
        results['sellers'] = [dict(row) for row in cur.fetchall()]
    
    if lead_type == 'all' or lead_type == 'survey':
        cur.execute("SELECT id, name, email, phone, user_type, interest_type, rating, suggestions, region, created_at FROM leads ORDER BY created_at DESC")
        results['surveys'] = [dict(row) for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    
    for category in results:
        for item in results[category]:
            if item.get('created_at'):
                item['created_at'] = item['created_at'].isoformat()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(results, ensure_ascii=False)
    }
