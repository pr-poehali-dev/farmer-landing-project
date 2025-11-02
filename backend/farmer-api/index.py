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
                region = body_data.get('region', '')
                
                cur.execute(
                    f"""UPDATE {schema}.users 
                       SET first_name = %s, last_name = %s, phone = %s, email = %s, bio = %s, farm_name = %s
                       WHERE id = %s""",
                    (first_name, last_name, phone, email, bio, farm_name, user_id)
                )
                
                cur.execute(
                    f"""SELECT id FROM {schema}.farmer_data WHERE user_id = %s""",
                    (user_id,)
                )
                fd_exists = cur.fetchone()
                
                if fd_exists:
                    cur.execute(
                        f"""UPDATE {schema}.farmer_data SET region = %s WHERE user_id = %s""",
                        (region, user_id)
                    )
                else:
                    cur.execute(
                        f"""INSERT INTO {schema}.farmer_data (user_id, region) VALUES (%s, %s)""",
                        (user_id, region)
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Профиль обновлен'})
                }
            
            elif action == 'create_offer':
                farm_name = body_data.get('farm_name', '')
                title = body_data.get('title', '')
                description = body_data.get('description', '')
                asset = body_data.get('asset', {})
                total_amount = body_data.get('total_amount', 0)
                share_price = body_data.get('share_price', 0)
                min_shares = body_data.get('min_shares', 1)
                expected_monthly_income = body_data.get('expected_monthly_income')
                region = body_data.get('region', '')
                city = body_data.get('city', '')
                socials = body_data.get('socials', {})
                publish = body_data.get('publish', True)
                
                if not farm_name or not title or total_amount <= 0 or share_price <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля'})
                    }
                
                total_shares = int(round(total_amount / share_price))
                
                if abs(total_shares * share_price - total_amount) > 0.01:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Сумма не делится на целое число долей (проверьте цену доли)'})
                    }
                
                asset_json = json.dumps(asset)
                socials_json = json.dumps(socials)
                status = 'published' if publish else 'draft'
                
                cur.execute(
                    f"""INSERT INTO {schema}.investment_offers 
                       (farmer_id, farm_name, title, description, asset, total_amount, share_price,
                        total_shares, available_shares, min_shares, expected_monthly_income,
                        region, city, socials, status)
                       VALUES (%s, %s, %s, %s, %s::jsonb, %s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s)
                       RETURNING id, farm_name, title, total_amount, share_price, total_shares, 
                                 available_shares, expected_monthly_income, region, city, socials, status""",
                    (user_id, farm_name, title, description, asset_json, total_amount, share_price,
                     total_shares, total_shares, min_shares, expected_monthly_income,
                     region, city, socials_json, status)
                )
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'id': result[0],
                        'farm_name': result[1],
                        'title': result[2],
                        'total_amount': float(result[3]),
                        'share_price': float(result[4]),
                        'total_shares': result[5],
                        'available_shares': result[6],
                        'expected_monthly_income': float(result[7]) if result[7] else None,
                        'region': result[8],
                        'city': result[9],
                        'socials': result[10],
                        'status': result[11]
                    })
                }
            
            elif action == 'moderate_request':
                request_id = body_data.get('request_id')
                action_type = body_data.get('action_type')
                
                if not request_id or action_type not in ['approve', 'reject']:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверные параметры'})
                    }
                
                cur.execute(
                    f"""SELECT r.id, r.offer_id, r.shares_requested, r.status, r.investor_id,
                              o.available_shares, o.farmer_id
                       FROM {schema}.investment_requests r
                       JOIN {schema}.investment_offers o ON o.id = r.offer_id
                       WHERE r.id = %s""",
                    (request_id,)
                )
                row = cur.fetchone()
                
                if not row or row[6] != int(user_id):
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заявка не найдена'})
                    }
                
                if row[3] != 'pending':
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заявка уже обработана'})
                    }
                
                if action_type == 'approve':
                    shares_requested = row[2]
                    available_shares = row[5]
                    offer_id = row[1]
                    investor_id = row[4]
                    
                    if shares_requested > available_shares:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Недостаточно доступных долей'})
                        }
                    
                    cur.execute(
                        f"""UPDATE {schema}.investment_offers
                           SET available_shares = available_shares - %s, updated_at = now()
                           WHERE id = %s AND available_shares >= %s""",
                        (shares_requested, offer_id, shares_requested)
                    )
                    
                    if cur.rowcount == 0:
                        return {
                            'statusCode': 409,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Конфликт: долей уже не хватило'})
                        }
                    
                    cur.execute(
                        f"""UPDATE {schema}.investment_requests SET status = 'approved' WHERE id = %s""",
                        (request_id,)
                    )
                    
                    cur.execute(
                        f"""INSERT INTO {schema}.notifications (user_id, role, type, payload)
                           VALUES (%s, 'investor', 'request_approved', %s::jsonb)""",
                        (investor_id, json.dumps({'request_id': request_id}))
                    )
                    
                elif action_type == 'reject':
                    cur.execute(
                        f"""UPDATE {schema}.investment_requests SET status = 'rejected' WHERE id = %s""",
                        (request_id,)
                    )
                
                cur.execute(
                    f"""INSERT INTO {schema}.notifications (role, type, payload)
                       VALUES ('admin', 'request_moderated', %s::jsonb)""",
                    (json.dumps({'request_id': request_id, 'action': action_type}),)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            elif action == 'create_proposal':
                proposal_type = body_data.get('type', 'income')
                asset = body_data.get('asset', {})
                description = body_data.get('description', '')
                price = body_data.get('price', 0)
                shares = body_data.get('shares', 1)
                expected_product = body_data.get('expected_product') or None
                update_frequency = body_data.get('update_frequency') or 'weekly'
                income_details = body_data.get('income_details') or None
                
                print(f"DEBUG create_proposal: user_id={user_id} type={type(user_id)}, price={price} type={type(price)}, shares={shares} type={type(shares)}")
                print(f"DEBUG values: proposal_type={proposal_type}, asset={asset}, description={description}, income_details={income_details}")
                
                if not asset or not description or price <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля предложения'})
                    }
                
                asset_json = json.dumps(asset)
                asset_name = asset.get('name', '')
                asset_type_val = asset.get('type', '')
                income_details_json = json.dumps(income_details) if income_details else None
                
                try:
                    cur.execute(
                        f"""INSERT INTO {schema}.proposals 
                           (user_id, description, price, shares, type, status, 
                            asset, asset_type, asset_details, expected_product, update_frequency, income_details)
                           VALUES (%s, %s, %s, %s, %s, 'active', %s::jsonb, %s, %s, %s, %s, %s::jsonb) RETURNING id""",
                        (user_id, description, price, shares, proposal_type, 
                         asset_json, asset_type_val, asset_name, expected_product, update_frequency, income_details_json)
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
                    f"""SELECT u.first_name, u.last_name, u.phone, u.email, u.bio, u.farm_name, fd.region 
                       FROM {schema}.users u
                       LEFT JOIN {schema}.farmer_data fd ON u.id = fd.user_id
                       WHERE u.id = %s""",
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
                        'farm_name': result[5] or '',
                        'region': result[6] or ''
                    }
                else:
                    profile = {}
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'profile': profile})
                }
            
            elif action == 'get_offers':
                cur.execute(
                    f"""SELECT id, farm_name, title, total_amount, share_price, total_shares, 
                              available_shares, expected_monthly_income, region, city, socials, status
                       FROM {schema}.investment_offers WHERE farmer_id = %s ORDER BY id DESC""",
                    (user_id,)
                )
                offers = []
                for row in cur.fetchall():
                    offers.append({
                        'id': row[0],
                        'farm_name': row[1],
                        'title': row[2],
                        'total_amount': float(row[3]),
                        'share_price': float(row[4]),
                        'total_shares': row[5],
                        'available_shares': row[6],
                        'expected_monthly_income': float(row[7]) if row[7] else None,
                        'region': row[8],
                        'city': row[9],
                        'socials': row[10],
                        'status': row[11]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'offers': offers})
                }
            
            elif action == 'get_offer_requests':
                offer_id = params.get('offer_id')
                
                if not offer_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется offer_id'})
                    }
                
                cur.execute(
                    f"""SELECT r.id, r.investor_id, u.email, u.name, r.shares_requested, 
                              r.amount, r.status, r.message, r.created_at
                       FROM {schema}.investment_requests r
                       JOIN {schema}.users u ON u.id = r.investor_id
                       JOIN {schema}.investment_offers o ON o.id = r.offer_id
                       WHERE r.offer_id = %s AND o.farmer_id = %s
                       ORDER BY r.created_at DESC""",
                    (offer_id, user_id)
                )
                requests = []
                for row in cur.fetchall():
                    requests.append({
                        'id': row[0],
                        'investor_id': row[1],
                        'investor_email': row[2],
                        'investor_name': row[3],
                        'shares_requested': row[4],
                        'amount': float(row[5]),
                        'status': row[6],
                        'message': row[7],
                        'created_at': row[8].isoformat() if row[8] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'requests': requests})
                }
            
            elif action == 'get_proposal_requests':
                cur.execute(
                    f"""SELECT i.id, i.user_id, i.proposal_id, i.amount, i.shares, i.status, i.date,
                              p.description, p.type,
                              u.first_name, u.last_name, u.email
                       FROM {schema}.investments i
                       JOIN {schema}.proposals p ON i.proposal_id = p.id
                       JOIN {schema}.users u ON i.user_id = u.id
                       WHERE p.user_id = %s
                       ORDER BY i.date DESC""",
                    (user_id,)
                )
                
                requests = []
                for row in cur.fetchall():
                    requests.append({
                        'id': row[0],
                        'investor_id': row[1],
                        'proposal_id': row[2],
                        'amount': float(row[3]),
                        'shares': row[4],
                        'status': row[5] or 'pending',
                        'date': row[6].isoformat() if row[6] else None,
                        'proposal_description': row[7],
                        'proposal_type': row[8],
                        'investor_name': f"{row[9] or ''} {row[10] or ''}".strip() or row[11],
                        'investor_email': row[11]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'requests': requests})
                }
            
            elif action == 'get_proposals':
                cur.execute(
                    f"""SELECT id, description, price, shares, type, asset, 
                              expected_product, update_frequency, status, created_at, income_details
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
                        'created_at': row[9].isoformat() if row[9] else None,
                        'income_details': row[10] if row[10] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'proposals': proposals})
                }
            
            elif action == 'get_balance':
                cur.execute(
                    f"""SELECT balance FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                result = cur.fetchone()
                balance = float(result[0]) if result and result[0] else 0.0
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'balance': balance})
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