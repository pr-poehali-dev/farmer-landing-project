import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для фермеров (диагностика хозяйства, создание предложений)
    Args: event - dict с httpMethod, body, headers (X-Auth-Token с user_id)
          context - объект с request_id
    Returns: HTTP response с данными фермера или ошибкой
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
            
            if action == 'save_diagnosis':
                cows_count = body_data.get('cows_count')
                cows_type = body_data.get('cows_type', '')
                fields_hectares = body_data.get('fields_hectares')
                crops = body_data.get('crops', [])
                other_assets = body_data.get('other_assets', '')
                farm_name = body_data.get('farm_name', '')
                region = body_data.get('region', '')
                vk_link = body_data.get('vk_link', '')
                
                cur.execute(
                    "SELECT id FROM farmer_data WHERE user_id = %s",
                    (user_id,)
                )
                existing = cur.fetchone()
                
                crops_json = json.dumps(crops)
                
                if existing:
                    cur.execute(
                        """UPDATE farmer_data 
                           SET cows_count = %s, cows_type = %s, fields_hectares = %s, 
                               crops = %s::jsonb, other_assets = %s, farm_name = %s, region = %s, vk_link = %s,
                               updated_at = CURRENT_TIMESTAMP
                           WHERE user_id = %s""",
                        (cows_count, cows_type, fields_hectares, crops_json, other_assets, farm_name, region, vk_link, user_id)
                    )
                else:
                    cur.execute(
                        """INSERT INTO farmer_data 
                           (user_id, cows_count, cows_type, fields_hectares, crops, other_assets, farm_name, region, vk_link)
                           VALUES (%s, %s, %s, %s::jsonb, %s, %s, %s, %s, %s)""",
                        (user_id, cows_count, cows_type, fields_hectares, crops_json, other_assets, farm_name, region, vk_link)
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Диагностика сохранена'})
                }
            
            elif action == 'create_proposal':
                description = body_data.get('description', '')
                price = body_data.get('price', 0)
                shares = body_data.get('shares', 1)
                proposal_type = body_data.get('type', 'products')
                photo_url = body_data.get('photo_url', '')
                
                if not description or price <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля'})
                    }
                
                cur.execute(
                    """INSERT INTO proposals 
                       (user_id, photo_url, description, price, shares, type, status)
                       VALUES (%s, %s, %s, %s, %s, %s, 'active') RETURNING id""",
                    (user_id, photo_url, description, price, shares, proposal_type)
                )
                proposal_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'proposal_id': proposal_id})
                }
            
            elif action == 'create_proposal_v2':
                product_type = body_data.get('product_type', 'income')
                asset_type = body_data.get('asset_type', '')
                asset_details = body_data.get('asset_details', '')
                description = body_data.get('description', '')
                price = body_data.get('price', 0)
                shares = body_data.get('shares', 1)
                photo_url = body_data.get('photo_url', '')
                expected_product = body_data.get('expected_product', '')
                update_frequency = body_data.get('update_frequency', 'weekly')
                
                if not description or price <= 0 or not asset_type or not asset_details:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля'})
                    }
                
                schema = 't_p53065890_farmer_landing_proje'
                cur.execute(
                    f"""INSERT INTO {schema}.proposals 
                       (user_id, photo_url, description, price, shares, type, status, 
                        product_type, asset_type, asset_details, expected_product, update_frequency)
                       VALUES (%s, %s, %s, %s, %s, %s, 'active', %s, %s, %s, %s, %s) RETURNING id""",
                    (user_id, photo_url, description, price, shares, product_type, 
                     product_type, asset_type, asset_details, expected_product, update_frequency)
                )
                proposal_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'proposal_id': proposal_id})
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'get_diagnosis')
            
            if action == 'get_diagnosis':
                cur.execute(
                    """SELECT cows_count, cows_type, fields_hectares, crops, other_assets, farm_name, region, vk_link
                       FROM farmer_data WHERE user_id = %s""",
                    (user_id,)
                )
                result = cur.fetchone()
                
                if result:
                    data = {
                        'cows_count': result[0],
                        'cows_type': result[1],
                        'fields_hectares': result[2],
                        'crops': result[3] if result[3] else [],
                        'other_assets': result[4],
                        'farm_name': result[5] or '',
                        'region': result[6] or '',
                        'vk_link': result[7] or ''
                    }
                else:
                    data = None
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'diagnosis': data})
                }
            
            elif action == 'get_proposals':
                cur.execute(
                    """SELECT id, photo_url, description, price, shares, type, status, created_at
                       FROM proposals WHERE user_id = %s ORDER BY created_at DESC""",
                    (user_id,)
                )
                proposals = []
                for row in cur.fetchall():
                    proposals.append({
                        'id': row[0],
                        'photo_url': row[1],
                        'description': row[2],
                        'price': float(row[3]),
                        'shares': row[4],
                        'type': row[5],
                        'status': row[6],
                        'created_at': row[7].isoformat() if row[7] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'proposals': proposals})
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