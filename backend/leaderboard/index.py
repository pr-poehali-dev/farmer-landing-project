import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Leaderboard with nominations and regional filtering
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id
    Returns: HTTP response with leaderboard data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    params = event.get('queryStringParameters') or {}
    nomination = params.get('nomination', 'total')
    region = params.get('region', '')
    
    conn = psycopg2.connect(db_url)
    
    try:
        if nomination == 'total':
            result = get_total_leaderboard(conn, region)
        elif nomination == 'земля':
            result = get_crop_masters(conn, region)
        elif nomination == 'молоко':
            result = get_dairy_champions(conn, region)
        elif nomination == 'мясо':
            result = get_meat_leaders(conn, region)
        elif nomination == 'техника':
            result = get_tech_farmers(conn, region)
        else:
            result = get_total_leaderboard(conn, region)
        
        conn.close()
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result, default=str)
        }
    
    except Exception as e:
        conn.close()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }


def get_total_leaderboard(conn, region: str) -> List[dict]:
    '''Get overall rating leaderboard'''
    schema = 't_p53065890_farmer_landing_proje'
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        region_filter = ''
        params = []
        
        if region:
            region_filter = f'AND fd.region = %s'
            params.append(region)
        
        query = f'''
            SELECT 
                u.id::text as user_id,
                COALESCE(u.farm_name, u.name, 'Ферма №' || u.id) as farm_name,
                COALESCE(fd.region, 'Не указан') as region,
                COALESCE(fs.total_score, 0) as score,
                ROW_NUMBER() OVER (ORDER BY COALESCE(fs.total_score, 0) DESC) as rank
            FROM {schema}.users u
            LEFT JOIN {schema}.farmer_data fd ON u.id = fd.user_id
            LEFT JOIN {schema}.farmer_scores fs ON CAST(u.id AS TEXT) = fs.user_id
            WHERE u.role = 'farmer'
            {region_filter}
            ORDER BY score DESC
            LIMIT 100
        '''
        
        cur.execute(query, params)
        return [dict(row) for row in cur.fetchall()]


def get_crop_masters(conn, region: str) -> List[dict]:
    '''Get "Мастер Земли" leaderboard'''
    return get_total_leaderboard(conn, region)


def get_dairy_champions(conn, region: str) -> List[dict]:
    '''Get "Молочный Чемпион" leaderboard'''
    return get_total_leaderboard(conn, region)


def get_meat_leaders(conn, region: str) -> List[dict]:
    '''Get "Мясной Лидер" leaderboard'''
    return get_total_leaderboard(conn, region)


def get_tech_farmers(conn, region: str) -> List[dict]:
    '''Get "Техно-Фермер" leaderboard'''
    return get_total_leaderboard(conn, region)