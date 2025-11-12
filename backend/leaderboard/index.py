import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get farmer leaderboard with scores from database
    Args: event - dict with httpMethod, queryStringParameters (limit, current_user_id)
          context - object with request_id
    Returns: HTTP response with list of farmers sorted by score
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        params = event.get('queryStringParameters') or {}
        limit = int(params.get('limit', '50'))
        current_user_id = params.get('current_user_id')
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            raise ValueError('DATABASE_URL not configured')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        schema = 't_p53065890_farmer_landing_proje'
        
        query = f'''
            SELECT 
                u.id,
                u.name,
                u.email,
                COALESCE(NULLIF(TRIM(fd.region), ''), NULLIF(TRIM(u.region), ''), 'Не указан') as region,
                COALESCE(fs.total_score, 0) as total_score,
                fd.farm_name,
                fd.address,
                fd.description,
                diag.animals,
                diag.crops,
                (SELECT COUNT(*) FROM {schema}.investment_offers io WHERE io.farmer_id = u.id) as investment_count
            FROM {schema}.users u
            LEFT JOIN {schema}.farmer_scores fs ON CAST(u.id AS VARCHAR) = fs.user_id
            LEFT JOIN {schema}.farmer_data fd ON u.id = fd.user_id
            LEFT JOIN {schema}.farm_diagnostics diag ON u.id = diag.user_id
            WHERE u.role = 'farmer'
            ORDER BY COALESCE(fs.total_score, 0) DESC
            LIMIT {limit}
        '''
        
        cur.execute(query)
        rows = cur.fetchall()
        
        leaderboard: List[Dict[str, Any]] = []
        current_user_position = None
        
        for idx, row in enumerate(rows, start=1):
            user_id, name, email, region, total_score, farm_name, address, description, animals, crops, investment_count = row
            
            display_name = farm_name
            if not farm_name or farm_name.strip() == '':
                display_name = name if name and name.strip() else 'Аноним'
            
            entry = {
                'position': idx,
                'userId': user_id,
                'name': name or 'Аноним',
                'email': email,
                'region': region,
                'totalScore': total_score,
                'farmName': display_name,
                'address': address or '',
                'description': description or '',
                'animals': animals or [],
                'crops': crops or [],
                'investmentCount': investment_count or 0
            }
            
            leaderboard.append(entry)
            
            if current_user_id and str(user_id) == str(current_user_id):
                current_user_position = idx
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'leaderboard': leaderboard,
                'currentUserPosition': current_user_position,
                'totalCount': len(leaderboard)
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }