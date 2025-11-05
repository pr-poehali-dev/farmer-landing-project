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
                              sd.telegram_link, sd.products, sd.ads, sd.region, sd.city
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
                    'ads': row[15] or [],
                    'region': row[16],
                    'city': row[17]
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'profile': profile}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_farmers':
                cur.execute(
                    f"""SELECT subscription_tier FROM {schema}.users WHERE id = %s""",
                    (user_id,)
                )
                tier_row = cur.fetchone()
                tier = tier_row[0] if tier_row else 'none'
                
                region_filter = params.get('region', '')
                occupation_filter = params.get('occupation', '')
                
                query = f"""
                    SELECT u.id, u.first_name, u.last_name, u.farm_name, 
                           fd.region, fd.country, fd.assets
                """
                
                if tier == 'premium':
                    query += f""", u.email, u.phone, fd.gamification_points"""
                
                query += f"""
                    FROM {schema}.users u
                    LEFT JOIN {schema}.farmer_data fd ON fd.user_id = u.id
                    WHERE u.role = 'farmer'
                """
                
                if region_filter:
                    query += f" AND fd.region = '{region_filter}'"
                
                query += " ORDER BY u.id"
                
                cur.execute(query)
                rows = cur.fetchall()
                
                farmers = []
                for row in rows:
                    assets = row[6] or []
                    
                    if occupation_filter:
                        has_occupation = False
                        for asset in assets:
                            asset_type = asset.get('type', '')
                            if occupation_filter == 'animal' and asset_type == 'animal':
                                has_occupation = True
                                break
                            elif occupation_filter == 'crop' and asset_type == 'crop':
                                has_occupation = True
                                break
                            elif occupation_filter == 'beehive' and asset_type == 'beehive':
                                has_occupation = True
                                break
                        
                        if not has_occupation:
                            continue
                    
                    farmer = {
                        'id': row[0],
                        'name': f"{row[1] or ''} {row[2] or ''}".strip() or row[3] or 'Фермер',
                        'farmer_name': f"{row[1] or ''} {row[2] or ''}".strip() or 'Фермер',
                        'farm_name': row[3] or 'Ферма',
                        'region': row[4] or 'Не указан',
                        'country': row[5] or 'Не указана',
                        'occupation': 'Неизвестно',
                        'assets': assets
                    }
                    
                    if assets and len(assets) > 0:
                        occupations = []
                        for asset in assets:
                            asset_type = asset.get('type', '')
                            if asset_type == 'animal':
                                occupations.append('animal')
                            elif asset_type == 'crop':
                                occupations.append('crop')
                            elif asset_type == 'beehive':
                                occupations.append('beehive')
                        
                        if occupations:
                            farmer['occupation'] = occupations[0]
                    
                    if tier == 'premium':
                        farmer['email'] = row[7]
                        farmer['phone'] = row[8]
                        farmer['gamification_points'] = row[9] or 0
                    
                    farmers.append(farmer)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'farmers': farmers, 'tier': tier}),
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
            
            elif action == 'get_all_products':
                cur.execute(
                    f"""SELECT u.id, u.first_name, u.last_name, 
                              sd.company_name, sd.region, sd.city, sd.products
                       FROM {schema}.users u
                       LEFT JOIN {schema}.seller_data sd ON sd.user_id = u.id
                       WHERE u.role = 'seller' AND sd.products IS NOT NULL"""
                )
                rows = cur.fetchall()
                
                all_products = []
                for row in rows:
                    seller_id = row[0]
                    seller_name = row[3] or f"{row[1] or ''} {row[2] or ''}".strip() or 'Продавец'
                    seller_region = row[4]
                    seller_city = row[5]
                    products = row[6] or []
                    
                    for product in products:
                        if product.get('status') == 'active':
                            all_products.append({
                                'id': product.get('id'),
                                'seller_id': seller_id,
                                'seller_name': seller_name,
                                'seller_region': seller_region,
                                'seller_city': seller_city,
                                'type': product.get('type'),
                                'name': product.get('name'),
                                'price': product.get('price'),
                                'description': product.get('description'),
                                'photo_url': product.get('photo_url')
                            })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'products': all_products}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_product_requests':
                cur.execute(
                    f"""SELECT product_requests FROM {schema}.seller_data WHERE user_id = %s""",
                    (user_id,)
                )
                result = cur.fetchone()
                requests = result[0] if result and result[0] else []
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'requests': requests}),
                    'isBase64Encoded': False
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
                    'body': json.dumps({'balance': balance}),
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
                region = body_data.get('region', '')
                city = body_data.get('city', '')
                
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
                               vk_link = %s, telegram_link = %s, region = %s, city = %s, updated_at = CURRENT_TIMESTAMP
                           WHERE user_id = %s""",
                        (company_name, description, website, vk_link, telegram_link, region, city, user_id)
                    )
                else:
                    cur.execute(
                        f"""INSERT INTO {schema}.seller_data 
                           (user_id, company_name, description, website, vk_link, telegram_link, region, city)
                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                        (user_id, company_name, description, website, vk_link, telegram_link, region, city)
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
                
                cur.execute(
                    f"""SELECT products FROM {schema}.seller_data WHERE user_id = %s""",
                    (user_id,)
                )
                products_row = cur.fetchone()
                current_products = products_row[0] if products_row and products_row[0] else []
                products_count = len(current_products)
                
                if tier == 'none' and products_count >= 10:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Достигнут лимит бесплатных товаров (10). Оформите подписку для безлимитного добавления.'}),
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
                
                current_products.append(product)
                
                cur.execute(
                    f"""UPDATE {schema}.seller_data SET products = %s::jsonb WHERE user_id = %s""",
                    (json.dumps(current_products), user_id)
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
            
            elif action == 'request_product':
                product_id = body_data.get('product_id', '')
                seller_id = body_data.get('seller_id', '')
                farmer_name = body_data.get('farmer_name', '')
                farmer_phone = body_data.get('farmer_phone', '')
                farmer_region = body_data.get('farmer_region', '')
                product_name = body_data.get('product_name', '')
                message = body_data.get('message', '')
                
                cur.execute(
                    f"""SELECT product_requests FROM {schema}.seller_data WHERE user_id = %s""",
                    (seller_id,)
                )
                row = cur.fetchone()
                requests = row[0] if row and row[0] else []
                
                new_request = {
                    'id': str(int(time.time() * 1000)),
                    'product_id': product_id,
                    'product_name': product_name,
                    'farmer_id': user_id,
                    'farmer_name': farmer_name,
                    'farmer_phone': farmer_phone,
                    'farmer_region': farmer_region,
                    'message': message,
                    'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'status': 'new'
                }
                
                requests.append(new_request)
                
                cur.execute(
                    f"""UPDATE {schema}.seller_data SET product_requests = %s::jsonb WHERE user_id = %s""",
                    (json.dumps(requests), seller_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'request_id': new_request['id']}),
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