import json
import os
import psycopg2
from typing import Dict, Any

ADMIN_SECRET = "farmer_admin_2025_secret_key"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Удаление пользователей с каскадным удалением всех связанных данных
    Args: event - dict с httpMethod, body, headers
          context - объект с request_id
    Returns: HTTP response с результатом удаления
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Secret',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Только POST запросы'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    admin_secret = headers.get('x-admin-secret') or headers.get('X-Admin-Secret')
    
    if admin_secret != ADMIN_SECRET:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Доступ запрещен'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    user_ids = body_data.get('user_ids', [])
    
    if not user_ids:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Список user_ids пуст'}),
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
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        schema = 't_p53065890_farmer_landing_proje'
        deleted_count = 0
        
        for user_id in user_ids:
            # Удаляем инвестиции пользователя
            cur.execute(f"DELETE FROM {schema}.investments WHERE user_id = %s", (user_id,))
            
            # Удаляем инвестиции В предложения этого пользователя
            cur.execute(f"""
                DELETE FROM {schema}.investments 
                WHERE proposal_id IN (
                    SELECT id FROM {schema}.proposals WHERE user_id = %s
                )
            """, (user_id,))
            
            # Теперь можно удалить предложения
            cur.execute(f"DELETE FROM {schema}.proposals WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {schema}.products WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {schema}.ads WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {schema}.farmer_data WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {schema}.seller_data WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {schema}.garage WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {schema}.leaderboard WHERE user_id = %s", (user_id,))
            
            # Удаляем самого пользователя
            cur.execute(f"DELETE FROM {schema}.users WHERE id = %s", (user_id,))
            if cur.rowcount > 0:
                deleted_count += 1
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': f'Удалено пользователей: {deleted_count}',
                'deleted_count': deleted_count
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка удаления: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()