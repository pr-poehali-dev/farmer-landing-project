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
    Business: Аутентификация пользователей (регистрация, логин, проверка токена), админ-функции и статистика
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
                
                cur.execute("SELECT id FROM t_p53065890_farmer_landing_proje.users WHERE LOWER(email) = %s", (email,))
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
                
                cur.execute("SELECT id, password_hash, role, name FROM t_p53065890_farmer_landing_proje.users WHERE LOWER(email) = %s", (email,))
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
            
            elif action == 'reset_password_request':
                email = body_data.get('email', '').strip().lower()
                
                if not email:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Введите email'})
                    }
                
                cur.execute("SELECT id FROM t_p53065890_farmer_landing_proje.users WHERE LOWER(email) = %s", (email,))
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'message': 'Если email существует, инструкции отправлены'})
                    }
                
                reset_token = jwt.encode({
                    'user_id': user[0],
                    'email': email,
                    'type': 'reset',
                    'exp': datetime.utcnow() + timedelta(hours=1)
                }, jwt_secret, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'message': 'Токен сброса создан',
                        'reset_token': reset_token
                    })
                }
            
            elif action == 'reset_password':
                reset_token = body_data.get('reset_token', '')
                new_password = body_data.get('new_password', '')
                
                if not reset_token or not new_password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Токен и новый пароль обязательны'})
                    }
                
                payload = jwt.decode(reset_token, jwt_secret, algorithms=['HS256'])
                
                if payload.get('type') != 'reset':
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный токен'})
                    }
                
                user_id = payload['user_id']
                password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                
                cur.execute(
                    "UPDATE t_p53065890_farmer_landing_proje.users SET password_hash = %s WHERE id = %s",
                    (password_hash, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Пароль успешно изменен'})
                }
            
            elif action == 'list_users':
                headers = event.get('headers', {})
                admin_secret = headers.get('x-admin-secret') or headers.get('X-Admin-Secret')
                
                if admin_secret != ADMIN_SECRET:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'})
                    }
                
                cur.execute("SELECT id, email, role, created_at FROM t_p53065890_farmer_landing_proje.users ORDER BY id")
                users = cur.fetchall()
                
                users_list = [{
                    'id': u[0],
                    'email': u[1],
                    'role': u[2],
                    'created_at': u[3].isoformat() if u[3] else None
                } for u in users]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'users': users_list})
                }
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters', {})
            action = query_params.get('action', '')
            
            if action == 'stats':
                cur.execute("""
                    SELECT 
                        role,
                        COUNT(*) as count
                    FROM t_p53065890_farmer_landing_proje.users
                    GROUP BY role
                """)
                
                results = cur.fetchall()
                
                stats = {
                    'farmers': 0,
                    'investors': 0,
                    'sellers': 0,
                    'total': 0
                }
                
                for role, count in results:
                    if role == 'farmer':
                        stats['farmers'] = count
                    elif role == 'investor':
                        stats['investors'] = count
                    elif role == 'seller':
                        stats['sellers'] = count
                    stats['total'] += count
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(stats)
                }
            
            elif action == 'admin':
                # Admin statistics - comprehensive data for admin panel
                cur.execute("SELECT role, COUNT(*) as count FROM t_p53065890_farmer_landing_proje.users GROUP BY role")
                users_by_role_results = cur.fetchall()
                users_by_role = {}
                for role, count in users_by_role_results:
                    users_by_role[role] = count
                
                cur.execute("SELECT COUNT(*) FROM t_p53065890_farmer_landing_proje.proposals")
                total_proposals = cur.fetchone()[0]
                
                cur.execute("SELECT COUNT(*) FROM t_p53065890_farmer_landing_proje.proposals WHERE status = 'active'")
                active_proposals = cur.fetchone()[0]
                
                cur.execute("SELECT COUNT(*) FROM t_p53065890_farmer_landing_proje.investments")
                total_investments = cur.fetchone()[0]
                
                cur.execute("SELECT COALESCE(SUM(amount), 0) FROM t_p53065890_farmer_landing_proje.investments")
                total_invested = float(cur.fetchone()[0])
                
                cur.execute("""
                    SELECT 
                        u.id, u.email, u.name, u.role, u.created_at,
                        COALESCE(p.count, 0) as proposals_count,
                        COALESCE(i.count, 0) as investments_count
                    FROM t_p53065890_farmer_landing_proje.users u
                    LEFT JOIN (SELECT user_id, COUNT(*) as count FROM t_p53065890_farmer_landing_proje.proposals GROUP BY user_id) p ON u.id = p.user_id
                    LEFT JOIN (SELECT investor_id, COUNT(*) as count FROM t_p53065890_farmer_landing_proje.investments GROUP BY investor_id) i ON u.id = i.investor_id
                    ORDER BY u.created_at DESC
                """)
                users_results = cur.fetchall()
                users = []
                for u in users_results:
                    users.append({
                        'id': u[0],
                        'email': u[1],
                        'name': u[2],
                        'role': u[3],
                        'created_at': u[4].isoformat() if u[4] else None,
                        'proposals_count': u[5],
                        'investments_count': u[6]
                    })
                
                cur.execute("""
                    SELECT 
                        p.id, p.description, p.price, p.shares, p.type, p.status,
                        u.name as farmer_name, u.email as farmer_email,
                        COALESCE(i.count, 0) as investors_count
                    FROM t_p53065890_farmer_landing_proje.proposals p
                    JOIN t_p53065890_farmer_landing_proje.users u ON p.user_id = u.id
                    LEFT JOIN (SELECT proposal_id, COUNT(DISTINCT investor_id) as count FROM t_p53065890_farmer_landing_proje.investments GROUP BY proposal_id) i ON p.id = i.proposal_id
                    ORDER BY p.created_at DESC
                """)
                proposals_results = cur.fetchall()
                proposals = []
                for p in proposals_results:
                    proposals.append({
                        'id': p[0],
                        'description': p[1],
                        'price': float(p[2]) if p[2] else 0,
                        'shares': p[3],
                        'type': p[4],
                        'status': p[5],
                        'farmer_name': p[6],
                        'farmer_email': p[7],
                        'investors_count': p[8]
                    })
                
                cur.execute("""
                    SELECT region, COUNT(*) as count 
                    FROM t_p53065890_farmer_landing_proje.farmer_profiles 
                    WHERE region IS NOT NULL 
                    GROUP BY region 
                    ORDER BY count DESC
                """)
                regions_results = cur.fetchall()
                regions = [{'name': r[0], 'count': r[1]} for r in regions_results]
                
                admin_stats = {
                    'overview': {
                        'users_by_role': users_by_role,
                        'total_proposals': total_proposals,
                        'active_proposals': active_proposals,
                        'total_investments': total_investments,
                        'total_invested': total_invested
                    },
                    'users': users,
                    'proposals': proposals,
                    'regions': regions
                }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(admin_stats)
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