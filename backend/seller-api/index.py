import json
import os
import psycopg2
import time
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для продавцов (управление товарами, рекламой, доступ к данным ферм)
    Args: event - dict с httpMethod, body, headers (X-User-Id)
          context - объект с request_id
    Returns: HTTP response с данными для продавца
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
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL не настроен'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    schema = 't_p53065890_farmer_landing_proje'
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'get_profile')
            
            if action == 'get_profile':
                cur.execute(
                    f"""SELECT u.id, u.email, u.name, u.first_name, u.last_name, u.phone, 
                              u.photo_url, u.subscription_tier, u.subscription_expires_at,
                              sd.company_name, sd.description, sd.website, sd.vk_link, 
                              sd.telegram_link, sd.products, sd.ads
                       FROM {schema}.users u
                       LEFT JOIN {schema}.seller_data sd ON sd.user_id = u.id
                       WHERE u.id = %s AND u.role = 'seller'""",
                    (user_id,)
                )
                row = cur.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Профиль продавца не найден'}),
                        'isBase64Encoded': False
                    }
                
                profile = {
                    'id': row[0],
                    'email': row[1],
                    'name': row[2],
                    'first_name': row[3],
                    'last_name': row[4],
                    'phone': row[5],
                    'photo_url': row[6],
                    'subscription_tier': row[7],
                    'subscription_expires_at': row[8].isoformat() if row[8] else None,
                    'company_name': row[9],
                    'description': row[10],
                    'website': row[11],
                    'vk_link': row[12],
                    'telegram_link': row[13],
                    'products': row[14] or [],
                    'ads': row[15] or []
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'profile': profile}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_farm_stats':
                cur.execute(
                    f"""SELECT subscription_tier FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                tier_row = cur.fetchone()
                tier = tier_row[0] if tier_row else 'none'
                
                if tier == 'none':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется подписка', 'tier': 'none'}),
                        'isBase64Encoded': False
                    }
                
                region_filter = params.get('region', '')
                
                if tier == 'basic':
                    query = f"""
                        SELECT fd.region, fd.assets, COUNT(*) as farm_count
                        FROM {schema}.farmer_data fd
                        WHERE fd.assets IS NOT NULL
                    """
                    if region_filter:
                        query += f" AND fd.region = '{region_filter}'"
                    query += " GROUP BY fd.region, fd.assets"
                    
                    cur.execute(query)
                    rows = cur.fetchall()
                    
                    stats = []
                    for row in rows:
                        assets = row[1] or []
                        for asset in assets:
                            stats.append({
                                'region': row[0],
                                'asset_type': asset.get('type', 'unknown'),
                                'asset_name': asset.get('name', 'unknown'),
                                'farm_count': row[2]
                            })
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'stats': stats, 'tier': 'basic'}),
                        'isBase64Encoded': False
                    }
                
                elif tier == 'premium':
                    query = f"""
                        SELECT u.id, u.first_name, u.last_name, u.farm_name, u.email, u.phone,
                               fd.region, fd.country, fd.assets
                        FROM {schema}.users u
                        LEFT JOIN {schema}.farmer_data fd ON fd.user_id = u.id
                        WHERE u.role = 'farmer' AND fd.analyzable = true
                    """
                    if region_filter:
                        query += f" AND fd.region = '{region_filter}'"
                    
                    cur.execute(query)
                    rows = cur.fetchall()
                    
                    farms = []
                    for row in rows:
                        farms.append({
                            'id': row[0],
                            'farmer_name': f"{row[1] or ''} {row[2] or ''}".strip() or 'Фермер',
                            'farm_name': row[3] or 'Ферма',
                            'email': row[4],
                            'phone': row[5],
                            'region': row[6],
                            'country': row[7],
                            'assets': row[8] or []
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'farms': farms, 'tier': 'premium'}),
                        'isBase64Encoded': False
                    }
            
            elif action == 'get_analytics':
                cur.execute(
                    f"""SELECT subscription_tier FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                tier_row = cur.fetchone()
                tier = tier_row[0] if tier_row else 'none'
                
                if tier == 'none':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется подписка'}),
                        'isBase64Encoded': False
                    }
                
                analytics = {
                    'product_views': 100,
                    'farm_requests': 5,
                    'commission_revenue': 2000
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'analytics': analytics}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', '')
            
            if action == 'update_profile':
                company_name = body_data.get('company_name', '')
                description = body_data.get('description', '')
                website = body_data.get('website', '')
                vk_link = body_data.get('vk_link', '')
                telegram_link = body_data.get('telegram_link', '')
                first_name = body_data.get('first_name', '')
                last_name = body_data.get('last_name', '')
                phone = body_data.get('phone', '')
                photo_url = body_data.get('photo_url', '')
                
                cur.execute(
                    f"""UPDATE {schema}.users 
                       SET first_name = %s, last_name = %s, phone = %s, photo_url = %s
                       WHERE id = %s""",
                    (first_name, last_name, phone, photo_url, user_id)
                )
                
                cur.execute(
                    f"""SELECT id FROM {schema}.seller_data WHERE user_id = %s""",
                    (user_id,)
                )
                exists = cur.fetchone()
                
                if exists:
                    cur.execute(
                        f"""UPDATE {schema}.seller_data 
                           SET company_name = %s, description = %s, website = %s, 
                               vk_link = %s, telegram_link = %s, updated_at = CURRENT_TIMESTAMP
                           WHERE user_id = %s""",
                        (company_name, description, website, vk_link, telegram_link, user_id)
                    )
                else:
                    cur.execute(
                        f"""INSERT INTO {schema}.seller_data 
                           (user_id, company_name, description, website, vk_link, telegram_link)
                           VALUES (%s, %s, %s, %s, %s, %s)""",
                        (user_id, company_name, description, website, vk_link, telegram_link)
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'add_product':
                cur.execute(
                    f"""SELECT subscription_tier FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                tier_row = cur.fetchone()
                tier = tier_row[0] if tier_row else 'none'
                
                if tier == 'none':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется подписка для добавления товаров'}),
                        'isBase64Encoded': False
                    }
                
                product_type = body_data.get('type', '')
                name = body_data.get('name', '')
                price = body_data.get('price', 0)
                description = body_data.get('description', '')
                photo_url = body_data.get('photo_url', '')
                target_audience = body_data.get('target_audience', [])
                
                if not name or price <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля'}),
                        'isBase64Encoded': False
                    }
                
                product = {
                    'id': str(int(time.time() * 1000)),
                    'type': product_type,
                    'name': name,
                    'price': price,
                    'description': description,
                    'photo_url': photo_url,
                    'target_audience': target_audience,
                    'status': 'active'
                }
                
                cur.execute(
                    f"""SELECT products FROM {schema}.seller_data WHERE user_id = %s""",
                    (user_id,)
                )
                row = cur.fetchone()
                products = row[0] if row and row[0] else []
                products.append(product)
                
                cur.execute(
                    f"""UPDATE {schema}.seller_data SET products = %s::jsonb WHERE user_id = %s""",
                    (json.dumps(products), user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'product_id': product['id']}),
                    'isBase64Encoded': False
                }
            
            elif action == 'delete_product':
                product_id = body_data.get('product_id', '')
                
                cur.execute(
                    f"""SELECT products FROM {schema}.seller_data WHERE user_id = %s""",
                    (user_id,)
                )
                row = cur.fetchone()
                products = row[0] if row and row[0] else []
                products = [p for p in products if p.get('id') != product_id]
                
                cur.execute(
                    f"""UPDATE {schema}.seller_data SET products = %s::jsonb WHERE user_id = %s""",
                    (json.dumps(products), user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'add_ad':
                cur.execute(
                    f"""SELECT subscription_tier FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                tier_row = cur.fetchone()
                tier = tier_row[0] if tier_row else 'none'
                
                if tier == 'none':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется подписка для размещения рекламы'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    f"""SELECT ads FROM {schema}.seller_data WHERE user_id = %s""",
                    (user_id,)
                )
                row = cur.fetchone()
                ads = row[0] if row and row[0] else []
                
                if tier == 'basic' and len(ads) >= 1:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Базовая подписка позволяет 1 баннер. Обновите до Premium'}),
                        'isBase64Encoded': False
                    }
                
                ad_name = body_data.get('name', '')
                image_url = body_data.get('image_url', '')
                text = body_data.get('text', '')
                link = body_data.get('link', '')
                target_audience = body_data.get('target_audience', '')
                
                if not ad_name or not image_url:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните обязательные поля'}),
                        'isBase64Encoded': False
                    }
                
                ad = {
                    'id': str(int(time.time() * 1000)),
                    'name': ad_name,
                    'image_url': image_url,
                    'text': text,
                    'link': link,
                    'target_audience': target_audience,
                    'status': 'active',
                    'views': 0
                }
                
                ads.append(ad)
                
                cur.execute(
                    f"""UPDATE {schema}.seller_data SET ads = %s::jsonb WHERE user_id = %s""",
                    (json.dumps(ads), user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'ad_id': ad['id']}),
                    'isBase64Encoded': False
                }
            
            elif action == 'delete_ad':
                ad_id = body_data.get('ad_id', '')
                
                cur.execute(
                    f"""SELECT ads FROM {schema}.seller_data WHERE user_id = %s""",
                    (user_id,)
                )
                row = cur.fetchone()
                ads = row[0] if row and row[0] else []
                ads = [a for a in ads if a.get('id') != ad_id]
                
                cur.execute(
                    f"""UPDATE {schema}.seller_data SET ads = %s::jsonb WHERE user_id = %s""",
                    (json.dumps(ads), user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неизвестное действие'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()