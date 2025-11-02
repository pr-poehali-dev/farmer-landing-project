import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для инвесторов (просмотр предложений, создание инвестиций)
    Args: event - dict с httpMethod, body, headers (X-User-Id)
          context - объект с request_id
    Returns: HTTP response с данными для инвестора
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
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'get_proposals')
            
            if action == 'get_offers':
                schema = 't_p53065890_farmer_landing_proje'
                
                cur.execute(
                    f"""SELECT o.id, o.farm_name, o.title, o.total_amount, o.share_price, 
                              o.available_shares, o.expected_monthly_income, o.region, o.city, o.socials,
                              u.name, u.email
                       FROM {schema}.investment_offers o
                       JOIN {schema}.users u ON o.farmer_id = u.id
                       WHERE o.status = 'published'
                       ORDER BY o.id DESC"""
                )
                
                offers = []
                for row in cur.fetchall():
                    offers.append({
                        'id': row[0],
                        'farm_name': row[1],
                        'title': row[2],
                        'total_amount': float(row[3]),
                        'share_price': float(row[4]),
                        'available_shares': row[5],
                        'expected_monthly_income': float(row[6]) if row[6] else None,
                        'region': row[7],
                        'city': row[8],
                        'socials': row[9],
                        'farmer_name': row[10] or row[11]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'offers': offers})
                }
            
            elif action == 'get_offer':
                schema = 't_p53065890_farmer_landing_proje'
                offer_id = params.get('offer_id')
                
                if not offer_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется offer_id'})
                    }
                
                cur.execute(
                    f"""SELECT o.id, o.farm_name, o.title, o.description, o.asset, 
                              o.total_amount, o.share_price, o.total_shares, o.available_shares, 
                              o.min_shares, o.expected_monthly_income, o.region, o.city, o.socials,
                              u.name, u.email
                       FROM {schema}.investment_offers o
                       JOIN {schema}.users u ON o.farmer_id = u.id
                       WHERE o.id = %s AND o.status = 'published'""",
                    (offer_id,)
                )
                
                row = cur.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Предложение не найдено'})
                    }
                
                offer = {
                    'id': row[0],
                    'farm_name': row[1],
                    'title': row[2],
                    'description': row[3],
                    'asset': row[4],
                    'total_amount': float(row[5]),
                    'share_price': float(row[6]),
                    'total_shares': row[7],
                    'available_shares': row[8],
                    'min_shares': row[9],
                    'expected_monthly_income': float(row[10]) if row[10] else None,
                    'region': row[11],
                    'city': row[12],
                    'socials': row[13],
                    'farmer_name': row[14] or row[15]
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'offer': offer})
                }
            
            elif action == 'get_proposals':
                proposal_type = params.get('type', '')
                
                query = """
                    SELECT p.id, p.user_id, p.photo_url, p.description, p.price, 
                           p.shares, p.type, p.status, p.created_at, u.name, u.email
                    FROM proposals p
                    JOIN users u ON p.user_id = u.id
                    WHERE p.status = 'active'
                """
                
                if proposal_type:
                    query += f" AND p.type = '{proposal_type}'"
                
                query += " ORDER BY p.created_at DESC"
                
                cur.execute(query)
                proposals = []
                for row in cur.fetchall():
                    proposals.append({
                        'id': row[0],
                        'farmer_id': row[1],
                        'photo_url': row[2],
                        'description': row[3],
                        'price': float(row[4]),
                        'shares': row[5],
                        'type': row[6],
                        'status': row[7],
                        'created_at': row[8].isoformat() if row[8] else None,
                        'farmer_name': row[9] or row[10]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'proposals': proposals})
                }
            
            elif action == 'get_all_proposals':
                schema = 't_p53065890_farmer_landing_proje'
                proposal_type = params.get('type', '')
                
                query = f"""
                    SELECT p.id, p.description, p.price, p.shares, p.type,
                           p.asset, p.expected_product, p.update_frequency,
                           u.first_name, u.last_name, u.farm_name, fd.region,
                           (SELECT COUNT(*) FROM {schema}.investments i WHERE i.proposal_id = p.id) as investors_count,
                           p.user_id
                    FROM {schema}.proposals p
                    LEFT JOIN {schema}.users u ON p.user_id = u.id
                    LEFT JOIN {schema}.farmer_data fd ON p.user_id = fd.user_id
                    WHERE p.status = 'active'
                """
                
                if proposal_type:
                    query += f" AND p.type = '{proposal_type}'"
                
                query += " ORDER BY p.created_at DESC"
                
                cur.execute(query)
                
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
                        'farmer_name': f"{row[8] or ''} {row[9] or ''}".strip() or row[10] or 'Фермер',
                        'farm_name': row[10] or 'Ферма',
                        'region': row[11] or 'Регион не указан',
                        'investors_count': row[12],
                        'farmer_id': row[13]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'proposals': proposals})
                }
            
            elif action == 'get_farmers':
                schema = 't_p53065890_farmer_landing_proje'
                region = params.get('region', '')
                asset_types_str = params.get('asset_types', '')
                product_types_str = params.get('product_types', '')
                
                asset_types = [t.strip() for t in asset_types_str.split(',') if t.strip()] if asset_types_str else []
                product_types = [t.strip() for t in product_types_str.split(',') if t.strip()] if product_types_str else []
                
                query = f"""
                    SELECT 
                        u.id as user_id,
                        u.first_name,
                        u.last_name,
                        u.farm_name,
                        fd.country,
                        fd.region,
                        u.bio,
                        u.photo_url
                    FROM {schema}.users u
                    LEFT JOIN {schema}.farmer_data fd ON fd.user_id = u.id
                    WHERE u.role = 'farmer'
                """
                
                conditions = []
                
                if region:
                    conditions.append(f"fd.region = '{region}'")
                
                if asset_types:
                    asset_conditions = " OR ".join([f"p.asset_type = '{at}'" for at in asset_types])
                    conditions.append(f"({asset_conditions})")
                
                if product_types:
                    product_conditions = " OR ".join([f"p.product_type = '{pt}'" for pt in product_types])
                    conditions.append(f"({product_conditions})")
                
                if conditions:
                    query += " AND " + " AND ".join(conditions)
                
                query += " ORDER BY u.id"
                
                cur.execute(query)
                rows = cur.fetchall()
                
                farmers = []
                for row in rows:
                    user_id = row[0]
                    
                    cur.execute(f"""
                        SELECT 
                            p.id, p.photo_url, p.description, p.price, p.shares,
                            p.product_type, p.asset_type, p.asset_details,
                            p.expected_product, p.update_frequency, p.created_at
                        FROM {schema}.proposals p
                        WHERE p.user_id = {user_id}
                        ORDER BY p.created_at DESC
                    """)
                    
                    proposals = []
                    for p_row in cur.fetchall():
                        proposals.append({
                            'id': p_row[0],
                            'photo_url': p_row[1] or '',
                            'description': p_row[2] or '',
                            'price': float(p_row[3]) if p_row[3] else 0,
                            'shares': p_row[4] or 0,
                            'product_type': p_row[5] or '',
                            'asset_type': p_row[6] or '',
                            'asset_details': p_row[7] or '',
                            'expected_product': p_row[8] or '',
                            'update_frequency': p_row[9] or '',
                            'created_at': p_row[10].isoformat() if p_row[10] else None
                        })
                    
                    farmer = {
                        'user_id': str(row[0]),
                        'first_name': row[1] or '',
                        'last_name': row[2] or '',
                        'farm_name': row[3] or '',
                        'country': row[4] or 'Россия',
                        'region': row[5] or '',
                        'bio': row[6] or '',
                        'photo_url': row[7] or '',
                        'proposals': proposals
                    }
                    farmers.append(farmer)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'farmers': farmers})
                }
            
            elif action == 'get_portfolio':
                cur.execute(
                    """SELECT i.id, i.proposal_id, i.amount, i.date, i.status,
                              p.description, p.type, u.name, u.email
                       FROM investments i
                       JOIN proposals p ON i.proposal_id = p.id
                       JOIN users u ON p.user_id = u.id
                       WHERE i.user_id = %s AND (i.status IS NULL OR i.status != 'cancelled')
                       ORDER BY i.date DESC""",
                    (user_id,)
                )
                
                investments = []
                for row in cur.fetchall():
                    investments.append({
                        'id': row[0],
                        'proposal_id': row[1],
                        'amount': float(row[2]),
                        'date': row[3].isoformat() if row[3] else None,
                        'status': row[4] or 'pending',
                        'proposal_description': row[5],
                        'proposal_type': row[6],
                        'farmer_name': row[7] or row[8]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'investments': investments})
                }
            
            elif action == 'get_balance':
                schema = 't_p53065890_farmer_landing_proje'
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
            
            elif action == 'get_my_requests':
                schema = 't_p53065890_farmer_landing_proje'
                cur.execute(
                    f"""SELECT i.id, i.proposal_id, i.amount, i.shares, i.status, i.date,
                              p.description, p.type, u.first_name, u.last_name, u.farm_name
                       FROM {schema}.investments i
                       JOIN {schema}.proposals p ON i.proposal_id = p.id
                       JOIN {schema}.users u ON p.user_id = u.id
                       WHERE i.user_id = %s
                       ORDER BY i.date DESC""",
                    (user_id,)
                )
                
                requests = []
                for row in cur.fetchall():
                    requests.append({
                        'id': row[0],
                        'proposal_id': row[1],
                        'amount': float(row[2]),
                        'shares': row[3],
                        'status': row[4] or 'pending',
                        'date': row[5].isoformat() if row[5] else None,
                        'proposal_description': row[6],
                        'proposal_type': row[7],
                        'farmer_name': f"{row[8] or ''} {row[9] or ''}".strip() or row[10] or 'Фермер'
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'requests': requests})
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create_request':
                schema = 't_p53065890_farmer_landing_proje'
                offer_id = body_data.get('offer_id')
                shares_requested = body_data.get('shares_requested', 0)
                message = body_data.get('message', '')
                
                if not offer_id or shares_requested <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Некорректные данные'})
                    }
                
                cur.execute(
                    f"""SELECT share_price, available_shares, farmer_id 
                       FROM {schema}.investment_offers 
                       WHERE id = %s AND status = 'published'""",
                    (offer_id,)
                )
                offer = cur.fetchone()
                
                if not offer:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Предложение не найдено'})
                    }
                
                share_price = float(offer[0])
                available_shares = offer[1]
                farmer_id = offer[2]
                
                if shares_requested > available_shares:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Запрошено больше долей, чем доступно'})
                    }
                
                amount = share_price * shares_requested
                
                cur.execute(
                    f"""INSERT INTO {schema}.investment_requests 
                       (offer_id, investor_id, shares_requested, amount, message, status)
                       VALUES (%s, %s, %s, %s, %s, 'pending')
                       RETURNING id""",
                    (offer_id, user_id, shares_requested, amount, message)
                )
                request_id = cur.fetchone()[0]
                
                cur.execute(
                    f"""INSERT INTO {schema}.notifications (user_id, role, type, payload)
                       VALUES (%s, 'farmer', 'request_created', %s::jsonb),
                              (NULL, 'admin', 'request_created', %s::jsonb)""",
                    (farmer_id, 
                     json.dumps({'request_id': request_id, 'offer_id': offer_id, 'investor_id': int(user_id)}),
                     json.dumps({'request_id': request_id, 'offer_id': offer_id, 'investor_id': int(user_id)}))
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'id': request_id, 'status': 'pending'})
                }
            
            elif action == 'invest':
                schema = 't_p53065890_farmer_landing_proje'
                proposal_id = body_data.get('proposal_id')
                amount = body_data.get('amount', 0)
                shares = body_data.get('shares', 1)
                
                if not proposal_id or amount <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Некорректные данные'})
                    }
                
                cur.execute(
                    f"SELECT id, user_id FROM {schema}.proposals WHERE id = %s AND status = 'active'", 
                    (proposal_id,)
                )
                proposal = cur.fetchone()
                if not proposal:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Предложение не найдено'})
                    }
                
                farmer_id = proposal[1]
                
                cur.execute(
                    f"""INSERT INTO {schema}.investments (user_id, proposal_id, amount, shares, status) 
                       VALUES (%s, %s, %s, %s, 'pending') 
                       RETURNING id""",
                    (user_id, proposal_id, amount, shares)
                )
                investment_id = cur.fetchone()[0]
                
                cur.execute(
                    f"""INSERT INTO {schema}.notifications (user_id, role, type, payload)
                       VALUES (%s, 'farmer', 'investment_request', %s::jsonb)""",
                    (farmer_id, 
                     json.dumps({'investment_id': investment_id, 'proposal_id': proposal_id, 'investor_id': int(user_id), 'shares': shares}))
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'investment_id': investment_id})
                }
            
            elif action == 'cancel_investment':
                schema = 't_p53065890_farmer_landing_proje'
                investment_id = body_data.get('investment_id')
                
                if not investment_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется investment_id'})
                    }
                
                cur.execute(
                    f"SELECT user_id, status FROM {schema}.investments WHERE id = %s",
                    (investment_id,)
                )
                investment = cur.fetchone()
                
                if not investment:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Инвестиция не найдена'})
                    }
                
                if str(investment[0]) != str(user_id):
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Нет доступа'})
                    }
                
                if investment[1] != 'pending':
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Можно отменить только ожидающие сделки'})
                    }
                
                cur.execute(
                    f"UPDATE {schema}.investments SET status = 'cancelled' WHERE id = %s",
                    (investment_id,)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            elif action == 'invest_virtual':
                proposal_id = body_data.get('proposal_id')
                product_type = body_data.get('product_type', 'income')
                
                if not proposal_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Некорректные данные'})
                    }
                
                schema = 't_p53065890_farmer_landing_proje'
                cur.execute(
                    f"SELECT price, expected_product FROM {schema}.proposals WHERE id = %s AND status = 'active'",
                    (proposal_id,)
                )
                proposal_data = cur.fetchone()
                
                if not proposal_data:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Предложение не найдено'})
                    }
                
                amount = float(proposal_data[0])
                expected_product = proposal_data[1]
                
                cur.execute(
                    f"INSERT INTO {schema}.investments (user_id, proposal_id, amount) VALUES (%s, %s, %s) RETURNING id",
                    (user_id, proposal_id, amount)
                )
                investment_id = cur.fetchone()[0]
                conn.commit()
                
                simulation = expected_product or 'Урожай для здоровья'
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'investment_id': investment_id,
                        'simulation': simulation
                    })
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