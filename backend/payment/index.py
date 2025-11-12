import json
import os
import psycopg2
import psycopg2.extras
import uuid
import base64
import requests
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создание платежей через ЮКасса и управление подписками
    Args: event - dict with httpMethod, body, headers
          context - object with request_id
    Returns: HTTP response with payment confirmation URL or status
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
            'isBase64Encoded': False,
            'body': ''
        }
    
    try:
        headers = event.get('headers') or {}
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'User ID required'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        yukassa_shop_id = os.environ.get('YUKASSA_SHOP_ID')
        yukassa_secret = os.environ.get('YUKASSA_SECRET_KEY')
        frontend_url = os.environ.get('FRONTEND_URL', 'https://farmer-landing-project.poehali.app')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'DATABASE_URL not configured'})
            }
        
        schema = 't_p53065890_farmer_landing_proje'
        conn = psycopg2.connect(database_url)
        
        # GET - получить текущую подписку и историю платежей
        if method == 'GET':
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                # Текущая подписка
                cur.execute(f'''
                    SELECT us.*, sp.tier, sp.daily_limit, sp.price_rub, sp.description, sp.features, sp.max_proposals
                    FROM {schema}.user_subscriptions us
                    LEFT JOIN {schema}.subscription_plans sp ON us.tier = sp.tier
                    WHERE us.user_id = %s AND us.status = 'active'
                    AND (us.expires_at IS NULL OR us.expires_at > NOW())
                    ORDER BY us.created_at DESC
                    LIMIT 1
                ''', (user_id,))
                
                subscription = cur.fetchone()
                
                # История платежей
                cur.execute(f'''
                    SELECT * FROM {schema}.payments
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    LIMIT 20
                ''', (int(user_id),))
                
                payments = cur.fetchall()
                
                # Лимиты использования
                cur.execute(f'''
                    SELECT * FROM {schema}.usage_limits
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    LIMIT 1
                ''', (user_id,))
                
                limits = cur.fetchone()
                
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'subscription': dict(subscription) if subscription else None,
                        'payments': [dict(p) for p in payments],
                        'limits': dict(limits) if limits else None
                    }, default=str)
                }
        
        # POST - создать платеж
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'create_payment')
            
            # Создание нового платежа
            if action == 'create_payment':
                tier = body_data.get('tier')
                
                if not tier:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Tier required'})
                    }
                
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    # Получаем план подписки
                    cur.execute(f'''
                        SELECT * FROM {schema}.subscription_plans
                        WHERE tier = %s AND is_active = true
                        LIMIT 1
                    ''', (tier,))
                    
                    plan = cur.fetchone()
                    
                    if not plan:
                        conn.close()
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'isBase64Encoded': False,
                            'body': json.dumps({'error': 'Plan not found'})
                        }
                    
                    # Бесплатный план - сразу активируем
                    if plan['price_rub'] == 0:
                        # Проверяем существующую подписку
                        cur.execute(f'''
                            SELECT id FROM {schema}.user_subscriptions
                            WHERE user_id = %s
                            LIMIT 1
                        ''', (user_id,))
                        
                        existing = cur.fetchone()
                        
                        if existing:
                            # Обновляем существующую
                            cur.execute(f'''
                                UPDATE {schema}.user_subscriptions
                                SET tier = %s, status = 'active', started_at = NOW(), expires_at = NOW() + INTERVAL '%s days', updated_at = NOW()
                                WHERE user_id = %s
                                RETURNING id
                            ''', (tier, plan['duration_days'], user_id))
                            sub_id = cur.fetchone()['id']
                        else:
                            # Создаем новую
                            cur.execute(f'''
                                INSERT INTO {schema}.user_subscriptions (user_id, tier, status, started_at, expires_at)
                                VALUES (%s, %s, 'active', NOW(), NOW() + INTERVAL '%s days')
                                RETURNING id
                            ''', (user_id, tier, plan['duration_days']))
                            sub_id = cur.fetchone()['id']
                        
                        # Проверяем существующие лимиты
                        cur.execute(f'''
                            SELECT id FROM {schema}.usage_limits
                            WHERE user_id = %s
                            LIMIT 1
                        ''', (int(user_id),))
                        
                        existing_limits = cur.fetchone()
                        
                        if existing_limits:
                            cur.execute(f'''
                                UPDATE {schema}.usage_limits
                                SET subscription_id = %s, reset_at = NOW() + INTERVAL '%s days', proposals_used = 0, updated_at = NOW()
                                WHERE user_id = %s
                            ''', (sub_id, plan['duration_days'], int(user_id)))
                        else:
                            cur.execute(f'''
                                INSERT INTO {schema}.usage_limits (user_id, subscription_id, proposals_used, reset_at)
                                VALUES (%s, %s, 0, NOW() + INTERVAL '%s days')
                            ''', (int(user_id), sub_id, plan['duration_days']))
                        
                        conn.commit()
                        conn.close()
                        
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'success': True,
                                'subscription_id': sub_id,
                                'message': 'Бесплатная подписка активирована'
                            })
                        }
                    
                    # Платный план - создаем платеж в ЮКасса
                    if not yukassa_shop_id or not yukassa_secret:
                        conn.close()
                        return {
                            'statusCode': 500,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'isBase64Encoded': False,
                            'body': json.dumps({'error': 'Payment system not configured. Add YUKASSA_SHOP_ID and YUKASSA_SECRET_KEY secrets.'})
                        }
                    
                    # Создаем запись о подписке (pending)
                    cur.execute(f'''
                        INSERT INTO {schema}.user_subscriptions (user_id, tier, status)
                        VALUES (%s, %s, 'pending')
                        RETURNING id
                    ''', (user_id, tier))
                    
                    subscription_id = cur.fetchone()['id']
                    
                    # Создаем идемпотентный ключ
                    idempotence_key = str(uuid.uuid4())
                    
                    # Формируем запрос к ЮКасса API
                    yukassa_url = 'https://api.yookassa.ru/v3/payments'
                    auth_string = f'{yukassa_shop_id}:{yukassa_secret}'
                    auth_header = base64.b64encode(auth_string.encode()).decode()
                    
                    payment_data = {
                        'amount': {
                            'value': str(plan['price_rub']),
                            'currency': 'RUB'
                        },
                        'confirmation': {
                            'type': 'redirect',
                            'return_url': f'{frontend_url}/dashboard/farmer?payment=success'
                        },
                        'capture': True,
                        'description': f"Подписка {plan['tier']} на {plan['duration_days']} дней",
                        'metadata': {
                            'user_id': str(user_id),
                            'subscription_id': str(subscription_id),
                            'tier': tier
                        }
                    }
                    
                    response = requests.post(
                        yukassa_url,
                        headers={
                            'Authorization': f'Basic {auth_header}',
                            'Idempotence-Key': idempotence_key,
                            'Content-Type': 'application/json'
                        },
                        json=payment_data,
                        timeout=10
                    )
                    
                    if response.status_code != 200:
                        conn.rollback()
                        conn.close()
                        return {
                            'statusCode': 500,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'isBase64Encoded': False,
                            'body': json.dumps({
                                'error': 'Payment creation failed',
                                'details': response.text
                            })
                        }
                    
                    payment_response = response.json()
                    yukassa_payment_id = payment_response.get('id')
                    confirmation_url = payment_response.get('confirmation', {}).get('confirmation_url')
                    
                    # Сохраняем платеж
                    cur.execute(f'''
                        INSERT INTO {schema}.payments 
                        (user_id, subscription_id, amount, status, yukassa_payment_id, yukassa_confirmation_url, metadata)
                        VALUES (%s, %s, %s, 'pending', %s, %s, %s)
                        RETURNING id
                    ''', (int(user_id), subscription_id, plan['price_rub'], yukassa_payment_id, confirmation_url, json.dumps({'tier': tier})))
                    
                    payment_id = cur.fetchone()['id']
                    
                    conn.commit()
                    conn.close()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({
                            'success': True,
                            'payment_id': payment_id,
                            'confirmation_url': confirmation_url,
                            'amount': plan['price_rub']
                        })
                    }
            
            # Webhook от ЮКасса о статусе платежа
            elif action == 'webhook':
                yukassa_data = body_data.get('object', {})
                yukassa_payment_id = yukassa_data.get('id')
                status = yukassa_data.get('status')
                
                if not yukassa_payment_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Invalid webhook data'})
                    }
                
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    # Находим платеж
                    cur.execute(f'''
                        SELECT p.*, us.tier, sp.duration_days
                        FROM {schema}.payments p
                        LEFT JOIN {schema}.user_subscriptions us ON p.subscription_id = us.id
                        LEFT JOIN {schema}.subscription_plans sp ON us.tier = sp.tier
                        WHERE p.yukassa_payment_id = %s
                        LIMIT 1
                    ''', (yukassa_payment_id,))
                    
                    payment = cur.fetchone()
                    
                    if not payment:
                        conn.close()
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'isBase64Encoded': False,
                            'body': json.dumps({'error': 'Payment not found'})
                        }
                    
                    # Обновляем статус платежа
                    cur.execute(f'''
                        UPDATE {schema}.payments
                        SET status = %s, paid_at = %s, updated_at = NOW()
                        WHERE yukassa_payment_id = %s
                    ''', (status, datetime.now() if status == 'succeeded' else None, yukassa_payment_id))
                    
                    # Если платеж успешен - активируем подписку
                    if status == 'succeeded':
                        duration_days = payment['duration_days'] or 30
                        
                        cur.execute(f'''
                            UPDATE {schema}.user_subscriptions
                            SET status = 'active', started_at = NOW(), expires_at = NOW() + INTERVAL '%s days'
                            WHERE id = %s
                        ''', (duration_days, payment['subscription_id']))
                        
                        # Создаем или обновляем лимиты
                        cur.execute(f'''
                            SELECT id FROM {schema}.usage_limits
                            WHERE user_id = %s
                            LIMIT 1
                        ''', (payment['user_id'],))
                        
                        existing_lim = cur.fetchone()
                        
                        if existing_lim:
                            cur.execute(f'''
                                UPDATE {schema}.usage_limits
                                SET subscription_id = %s, reset_at = NOW() + INTERVAL '%s days', proposals_used = 0
                                WHERE user_id = %s
                            ''', (payment['subscription_id'], duration_days, payment['user_id']))
                        else:
                            cur.execute(f'''
                                INSERT INTO {schema}.usage_limits (user_id, subscription_id, proposals_used, reset_at)
                                VALUES (%s, %s, 0, NOW() + INTERVAL '%s days')
                            ''', (payment['user_id'], payment['subscription_id'], duration_days))
                    
                    # Если отменен - отменяем подписку
                    elif status in ['canceled', 'failed']:
                        cur.execute(f'''
                            UPDATE {schema}.user_subscriptions
                            SET status = 'canceled'
                            WHERE id = %s
                        ''', (payment['subscription_id'],))
                    
                    conn.commit()
                    conn.close()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True})
                    }
        
        conn.close()
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'error': str(e),
                'traceback': traceback.format_exc()
            })
        }