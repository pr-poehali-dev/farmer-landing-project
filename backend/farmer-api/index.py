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
                country = body_data.get('country', 'Россия')
                region = body_data.get('region', '')
                assets = body_data.get('assets', [])
                assets_json = json.dumps(assets)
                
                cur.execute(
                    f"""SELECT id FROM {schema}.farmer_data WHERE user_id = %s""",
                    (user_id,)
                )
                existing = cur.fetchone()
                
                if existing:
                    cur.execute(
                        f"""UPDATE {schema}.farmer_data 
                           SET country = %s, region = %s, assets = %s::jsonb
                           WHERE user_id = %s""",
                        (country, region, assets_json, user_id)
                    )
                else:
                    cur.execute(
                        f"""INSERT INTO {schema}.farmer_data (user_id, country, region, assets)
                           VALUES (%s, %s, %s, %s::jsonb)""",
                        (user_id, country, region, assets_json)
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
                proposal_type = body_data.get('type', 'income')
                asset = body_data.get('asset', {})
                description = body_data.get('description', '')
                price = body_data.get('price', 0)
                shares = body_data.get('shares', 1)
                expected_product = body_data.get('expected_product') or None
                update_frequency = body_data.get('update_frequency') or 'weekly'
                
                print(f"DEBUG create_proposal: user_id={user_id} type={type(user_id)}, price={price} type={type(price)}, shares={shares} type={type(shares)}")
                print(f"DEBUG values: proposal_type={proposal_type}, asset={asset}, description={description}")
                
                if not asset or not description or price <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля предложения'})
                    }
                
                asset_json = json.dumps(asset)
                asset_name = asset.get('name', '')
                asset_type_val = asset.get('type', '')
                
                try:
                    cur.execute(
                        f"""INSERT INTO {schema}.proposals 
                           (user_id, description, price, shares, type, status, 
                            asset, asset_type, asset_details, expected_product, update_frequency)
                           VALUES (%s, %s, %s, %s, %s, 'active', %s::jsonb, %s, %s, %s, %s) RETURNING id""",
                        (user_id, description, price, shares, proposal_type, 
                         asset_json, asset_type_val, asset_name, expected_product, update_frequency)
                    )
                except Exception as e:
                    print(f"ERROR inserting proposal: {str(e)}")
                    print(f"ERROR details: user_id={user_id}, description={description}, price={price}, shares={shares}")
                    raise
                proposal_id = cur.fetchone()[0]
                
                cur.execute(
                    f"""UPDATE {schema}.farmer_data 
                       SET gamification_points = COALESCE(gamification_points, 0) + 30 
                       WHERE user_id = %s""",
                    (user_id,)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'proposal_id': proposal_id})
                }
            
            elif action == 'delete_proposal':
                proposal_id = body_data.get('proposal_id')
                
                if not proposal_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется proposal_id'})
                    }
                
                cur.execute(
                    f"""DELETE FROM {schema}.proposals 
                       WHERE id = %s AND user_id = %s""",
                    (proposal_id, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'get_diagnosis')
            
            if action == 'get_diagnosis':
                cur.execute(
                    f"""SELECT fd.country, fd.region, fd.assets 
                       FROM {schema}.farmer_data fd 
                       WHERE fd.user_id = %s""",
                    (user_id,)
                )
                result = cur.fetchone()
                
                if result:
                    data = {
                        'country': result[0] or 'Россия',
                        'region': result[1] or '',
                        'assets': result[2] if result[2] else []
                    }
                else:
                    data = {
                        'country': 'Россия',
                        'region': '',
                        'assets': []
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
                    f"""SELECT id, description, price, shares, type, asset, 
                              expected_product, update_frequency, status, created_at
                       FROM {schema}.proposals WHERE user_id = %s ORDER BY created_at DESC""",
                    (user_id,)
                )
                proposals = []
                for row in cur.fetchall():
                    proposals.append({
                        'id': row[0],
                        'description': row[1],
                        'price': float(row[2]),
                        'shares': row[3],
                        'type': row[4],
                        'asset': row[5] if row[5] else {},
                        'expected_product': row[6],
                        'update_frequency': row[7],
                        'status': row[8],
                        'created_at': row[9].isoformat() if row[9] else None
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