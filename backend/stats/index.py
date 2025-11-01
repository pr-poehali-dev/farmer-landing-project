import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Статистика платформы (пользователи, предложения, инвестиции)
    Args: event - dict с httpMethod, headers
          context - объект с request_id
    Returns: HTTP response со статистикой или публичными счётчиками
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        action = params.get('action', 'public')
        
        if action == 'public':
            cur.execute("SELECT role, COUNT(*) FROM users GROUP BY role")
            role_counts = {row[0]: row[1] for row in cur.fetchall()}
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'farmers': role_counts.get('farmer', 0),
                    'investors': role_counts.get('investor', 0),
                    'sellers': role_counts.get('seller', 0),
                    'total': sum(role_counts.values())
                })
            }
        
        elif action == 'admin':
            
            cur.execute("SELECT role, COUNT(*) FROM users GROUP BY role")
            users_by_role = {row[0]: row[1] for row in cur.fetchall()}
            
            cur.execute("SELECT COUNT(*) FROM proposals")
            total_proposals = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM proposals WHERE status = 'active'")
            active_proposals = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM investments")
            total_investments = cur.fetchone()[0]
            
            cur.execute("SELECT COALESCE(SUM(amount), 0) FROM investments")
            total_invested = float(cur.fetchone()[0])
            
            cur.execute("""
                SELECT u.id, u.email, u.name, u.role, u.created_at,
                       (SELECT COUNT(*) FROM proposals WHERE user_id = u.id) as proposals_count,
                       (SELECT COUNT(*) FROM investments WHERE user_id = u.id) as investments_count
                FROM users u
                ORDER BY u.created_at DESC
                LIMIT 100
            """)
            
            users = []
            for row in cur.fetchall():
                users.append({
                    'id': row[0],
                    'email': row[1],
                    'name': row[2],
                    'role': row[3],
                    'created_at': row[4].isoformat() if row[4] else None,
                    'proposals_count': row[5],
                    'investments_count': row[6]
                })
            
            cur.execute("""
                SELECT p.id, p.description, p.price, p.shares, p.type, p.status,
                       u.name as farmer_name, u.email as farmer_email,
                       (SELECT COUNT(*) FROM investments WHERE proposal_id = p.id) as investors_count
                FROM proposals p
                JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
                LIMIT 50
            """)
            
            proposals = []
            for row in cur.fetchall():
                proposals.append({
                    'id': row[0],
                    'description': row[1],
                    'price': float(row[2]),
                    'shares': row[3],
                    'type': row[4],
                    'status': row[5],
                    'farmer_name': row[6],
                    'farmer_email': row[7],
                    'investors_count': row[8]
                })
            
            cur.execute("""
                SELECT region, COUNT(*) 
                FROM farmer_data 
                WHERE region IS NOT NULL 
                GROUP BY region 
                ORDER BY COUNT(*) DESC
            """)
            regions = [{'name': row[0], 'count': row[1]} for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
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
                })
            }
        
        elif action == 'proposals':
            cur.execute("""
                SELECT p.id, p.description, p.price, p.shares, p.type, p.photo_url,
                       u.name as farmer_name, u.email as farmer_email,
                       fd.farm_name, fd.region, fd.vk_link,
                       (SELECT COUNT(*) FROM investments WHERE proposal_id = p.id) as investors_count
                FROM proposals p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN farmer_data fd ON u.id = fd.user_id
                WHERE p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT 20
            """)
            
            proposals = []
            for row in cur.fetchall():
                proposals.append({
                    'id': row[0],
                    'description': row[1],
                    'price': float(row[2]),
                    'shares': row[3],
                    'type': row[4],
                    'photo_url': row[5] or '',
                    'farmer_name': row[6],
                    'farmer_email': row[7],
                    'farm_name': row[8] or '',
                    'region': row[9] or '',
                    'vk_link': row[10] or '',
                    'investors_count': row[11]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'proposals': proposals})
            }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неизвестное действие'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()