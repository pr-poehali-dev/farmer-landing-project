import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для фермеров (диагностика хозяйства, создание предложений, профиль)
    Args: event - dict с httpMethod, body, headers (X-User-Id)
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
    
    schema = 't_p53065890_farmer_landing_proje'
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'save_diagnosis':
                farm_info = body_data.get('farm_info', {})
                farm_info_json = json.dumps(farm_info)
                
                cur.execute(
                    f"""UPDATE {schema}.users 
                       SET farm_info = %s::jsonb, analyzable = true
                       WHERE id = %s""",
                    (farm_info_json, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Диагностика сохранена'})
                }
            
            elif action == 'update_profile':
                first_name = body_data.get('first_name', '')
                last_name = body_data.get('last_name', '')
                phone = body_data.get('phone', '')
                email = body_data.get('email', '')
                bio = body_data.get('bio', '')
                farm_name = body_data.get('farm_name', '')
                
                cur.execute(
                    f"""UPDATE {schema}.users 
                       SET first_name = %s, last_name = %s, phone = %s, email = %s, bio = %s, farm_name = %s
                       WHERE id = %s""",
                    (first_name, last_name, phone, email, bio, farm_name, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Профиль обновлен'})
                }
            
            elif action == 'create_proposal':
                product_type = body_data.get('product_type', 'income')
                asset_type = body_data.get('asset_type', '')
                asset_details = body_data.get('asset_details', '')
                description = body_data.get('description', '')
                price = body_data.get('price', 0)
                shares = body_data.get('shares', 1)
                photo_url = body_data.get('photo_url', '')
                expected_product = body_data.get('expected_product', '')
                update_frequency = body_data.get('update_frequency', 'weekly')
                
                cur.execute(
                    f"""SELECT first_name, last_name, phone, bio, farm_name FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                profile = cur.fetchone()
                
                if not profile or not all([profile[0], profile[1], profile[2], profile[3], profile[4]]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните профиль на 100% перед созданием предложения'})
                    }
                
                if not description or price <= 0 or not asset_type or not asset_details:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля предложения'})
                    }
                
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
                    f"""SELECT farm_info, analyzable FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                result = cur.fetchone()
                
                data = {
                    'farm_info': result[0] if result and result[0] else {},
                    'analyzable': result[1] if result else False
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'diagnosis': data})
                }
            
            elif action == 'get_profile':
                cur.execute(
                    f"""SELECT first_name, last_name, phone, email, bio, farm_name FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                result = cur.fetchone()
                
                if result:
                    profile = {
                        'first_name': result[0] or '',
                        'last_name': result[1] or '',
                        'phone': result[2] or '',
                        'email': result[3] or '',
                        'bio': result[4] or '',
                        'farm_name': result[5] or ''
                    }
                else:
                    profile = {}
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'profile': profile})
                }
            
            elif action == 'get_proposals':
                cur.execute(
                    f"""SELECT id, photo_url, description, price, shares, type, product_type, 
                              asset_type, asset_details, expected_product, update_frequency, 
                              status, created_at
                       FROM {schema}.proposals WHERE user_id = %s ORDER BY created_at DESC""",
                    (user_id,)
                )
                proposals = []
                for row in cur.fetchall():
                    proposals.append({
                        'id': row[0],
                        'photo_url': row[1] or '',
                        'description': row[2],
                        'price': float(row[3]),
                        'shares': row[4],
                        'type': row[5],
                        'product_type': row[6],
                        'asset_type': row[7],
                        'asset_details': row[8],
                        'expected_product': row[9],
                        'update_frequency': row[10],
                        'status': row[11],
                        'created_at': row[12].isoformat() if row[12] else None
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
