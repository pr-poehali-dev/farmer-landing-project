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
            
            if action == 'get_proposals':
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
            
            elif action == 'get_portfolio':
                cur.execute(
                    """SELECT i.id, i.proposal_id, i.amount, i.date, 
                              p.description, p.type, u.name, u.email
                       FROM investments i
                       JOIN proposals p ON i.proposal_id = p.id
                       JOIN users u ON p.user_id = u.id
                       WHERE i.user_id = %s
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
                        'proposal_description': row[4],
                        'proposal_type': row[5],
                        'farmer_name': row[6] or row[7]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'investments': investments})
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'invest':
                proposal_id = body_data.get('proposal_id')
                amount = body_data.get('amount', 0)
                
                if not proposal_id or amount <= 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Некорректные данные'})
                    }
                
                cur.execute("SELECT id FROM proposals WHERE id = %s AND status = 'active'", (proposal_id,))
                if not cur.fetchone():
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Предложение не найдено'})
                    }
                
                cur.execute(
                    "INSERT INTO investments (user_id, proposal_id, amount) VALUES (%s, %s, %s) RETURNING id",
                    (user_id, proposal_id, amount)
                )
                investment_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'investment_id': investment_id})
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
