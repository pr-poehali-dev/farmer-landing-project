import json
import os
import psycopg2
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any

ADMIN_SECRET = "farmer_admin_2025_secret_key"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Аутентификация пользователей (регистрация, логин, проверка токена) и админ-функции
    Args: event - dict с httpMethod, body, queryStringParameters, headers
          context - объект с request_id, function_name
    Returns: HTTP response с токеном или ошибкой
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Admin-Secret',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET')
    
    if not db_url or not jwt_secret:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Не настроены переменные окружения'})
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        if method == 'DELETE':
            headers = event.get('headers', {})
            admin_secret = headers.get('x-admin-secret') or headers.get('X-Admin-Secret')
            
            if admin_secret != ADMIN_SECRET:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            emails = body_data.get('emails', [])
            
            if not emails:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Список emails пуст'})
                }
            
            emails_lower = [email.strip().lower() for email in emails]
            placeholders = ','.join(['%s'] * len(emails_lower))
            
            cur.execute(
                f"DELETE FROM t_p53065890_farmer_landing_proje.users WHERE LOWER(email) IN ({placeholders}) RETURNING id, email",
                emails_lower
            )
            
            deleted_users = cur.fetchall()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': f'Удалено пользователей: {len(deleted_users)}',
                    'deleted': [{'id': u[0], 'email': u[1]} for u in deleted_users]
                })
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                email = body_data.get('email', '').strip().lower()
                password = body_data.get('password', '')
                role = body_data.get('role', '')
                name = body_data.get('name', '')
                
                if not email or not password or not role:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните все обязательные поля'})
                    }
                
                if role not in ['farmer', 'investor', 'seller']:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверная роль'})
                    }
                
                cur.execute("SELECT id FROM t_p53065890_farmer_landing_proje.users WHERE email = %s", (email,))
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email уже зарегистрирован'})
                    }
                
                password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                
                cur.execute(
                    "INSERT INTO t_p53065890_farmer_landing_proje.users (email, password_hash, role, name) VALUES (%s, %s, %s, %s) RETURNING id",
                    (email, password_hash, role, name)
                )
                user_id = cur.fetchone()[0]
                conn.commit()
                
                token = jwt.encode({
                    'user_id': user_id,
                    'email': email,
                    'role': role,
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, jwt_secret, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {'id': user_id, 'email': email, 'role': role, 'name': name}
                    })
                }
            
            elif action == 'login':
                email = body_data.get('email', '').strip().lower()
                password = body_data.get('password', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните все поля'})
                    }
                
                cur.execute("SELECT id, password_hash, role, name FROM t_p53065890_farmer_landing_proje.users WHERE email = %s", (email,))
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный email или пароль'})
                    }
                
                user_id, password_hash, role, name = user
                
                if not bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный email или пароль'})
                    }
                
                token = jwt.encode({
                    'user_id': user_id,
                    'email': email,
                    'role': role,
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, jwt_secret, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {'id': user_id, 'email': email, 'role': role, 'name': name}
                    })
                }
            
            elif action == 'verify':
                token = body_data.get('token', '')
                
                if not token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Токен не предоставлен'})
                    }
                
                payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
                user_id = payload['user_id']
                
                cur.execute("SELECT id, email, role, name FROM t_p53065890_farmer_landing_proje.users WHERE id = %s", (user_id,))
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': {'id': user[0], 'email': user[1], 'role': user[2], 'name': user[3]}
                    })
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен истёк'})
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный токен'})
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