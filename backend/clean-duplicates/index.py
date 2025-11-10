import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Admin function to clean duplicate investment_offers records
    Args: event - dict with httpMethod, body (farmer_id, keep_count)
          context - object with request_id
    Returns: HTTP response with cleanup results
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    farmer_id = body_data.get('farmer_id')
    keep_count = body_data.get('keep_count', 3)
    
    if not farmer_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'farmer_id is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    schema = 't_p53065890_farmer_landing_proje'
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(f'''
                SELECT id, created_at
                FROM {schema}.investment_offers
                WHERE farmer_id = %s
                ORDER BY created_at DESC
            ''', (farmer_id,))
            
            all_offers = cur.fetchall()
            total_count = len(all_offers)
            
            if total_count <= keep_count:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'message': 'No duplicates to clean',
                        'total_offers': total_count,
                        'kept': total_count,
                        'deleted': 0
                    }),
                    'isBase64Encoded': False
                }
            
            offers_to_keep = [offer['id'] for offer in all_offers[:keep_count]]
            offers_to_delete = [offer['id'] for offer in all_offers[keep_count:]]
            
            placeholders = ','.join(['%s'] * len(offers_to_delete))
            cur.execute(f'''
                DELETE FROM {schema}.investment_offers
                WHERE id IN ({placeholders})
            ''', offers_to_delete)
            
            deleted_count = cur.rowcount
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'farmer_id': farmer_id,
                    'total_offers': total_count,
                    'kept': keep_count,
                    'deleted': deleted_count,
                    'kept_ids': offers_to_keep,
                    'deleted_ids': offers_to_delete
                }),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        import traceback
        error_details = f"{str(e)}\n{traceback.format_exc()}"
        print(f"ERROR cleaning duplicates: {error_details}")
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Cleanup failed: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        conn.close()
