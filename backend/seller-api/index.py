import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для продавцов (создание товаров и рекламы)
    Args: event - dict с httpMethod, body, headers (X-User-Id)
          context - объект с request_id
    Returns: HTTP response с данными продавца
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL не настроен'})
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'add_product':
                product_type = body_data.get('type', '')
                description = body_data.get('description', '')
                price = body_data.get('price', 0)
                
                if not product_type or not description or price <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните все поля'})
                    }
                
                cur.execute(
                    "INSERT INTO products (user_id, type, description, price) VALUES (%s, %s, %s, %s) RETURNING id",
                    (user_id, product_type, description, price)
                )
                product_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'product_id': product_id})
                }
            
            elif action == 'create_ad':
                text = body_data.get('text', '')
                image_url = body_data.get('image_url', '')
                
                if not text:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Текст рекламы обязателен'})
                    }
                
                cur.execute(
                    "INSERT INTO ads (user_id, text, image_url, status) VALUES (%s, %s, %s, 'pending') RETURNING id",
                    (user_id, text, image_url)
                )
                ad_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'ad_id': ad_id})
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'get_products')
            
            if action == 'get_products':
                cur.execute(
                    "SELECT id, type, description, price, created_at FROM products WHERE user_id = %s ORDER BY created_at DESC",
                    (user_id,)
                )
                products = []
                for row in cur.fetchall():
                    products.append({
                        'id': row[0],
                        'type': row[1],
                        'description': row[2],
                        'price': float(row[3]),
                        'created_at': row[4].isoformat() if row[4] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'products': products})
                }
            
            elif action == 'get_ads':
                cur.execute(
                    "SELECT id, text, image_url, status, created_at FROM ads WHERE user_id = %s ORDER BY created_at DESC",
                    (user_id,)
                )
                ads = []
                for row in cur.fetchall():
                    ads.append({
                        'id': row[0],
                        'text': row[1],
                        'image_url': row[2],
                        'status': row[3],
                        'created_at': row[4].isoformat() if row[4] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'ads': ads})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()
