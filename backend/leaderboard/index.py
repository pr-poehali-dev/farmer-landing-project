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
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        region_filter = ''
        params = []
        
        if region:
            region_filter = 'AND fd.region = %s'
            params.append(region)
        
        cur.execute(f'''
            SELECT 
                u.id as user_id,
                COALESCE(u.farm_name, 'Ферма №' || u.id) as farm_name,
                fd.region,
                fd.rating_total as score,
                fd.rating_yield,
                fd.rating_technology,
                fd.rating_social,
                fd.rating_investment,
                fd.rating_professionalism,
                ROW_NUMBER() OVER (ORDER BY fd.rating_total DESC) as rank
            FROM farmer_data fd
            JOIN users u ON u.id = fd.user_id
            WHERE fd.rating_total > 0 {region_filter}
            ORDER BY fd.rating_total DESC
            LIMIT 100
        ''', params)
        
        return [dict(row) for row in cur.fetchall()]


def get_crop_masters(conn, region: str) -> List[dict]:
    '''Get "Мастер Земли" leaderboard (crop yield leaders)'''
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        region_filter = ''
        params = []
        
        if region:
            region_filter = 'AND fd.region = %s'
            params.append(region)
        
        cur.execute(f'''
            SELECT 
                u.id as user_id,
                COALESCE(u.farm_name, 'Ферма №' || u.id) as farm_name,
                fd.region,
                SUM(fc.sowing_area * fc.yield_per_hectare) as total_production,
                AVG(fc.yield_per_hectare) as avg_yield,
                SUM(fc.sowing_area) as total_area,
                ROW_NUMBER() OVER (ORDER BY SUM(fc.sowing_area * fc.yield_per_hectare) DESC) as rank
            FROM farmer_data fd
            JOIN users u ON u.id = fd.user_id
            JOIN farm_crops fc ON fc.farmer_data_id = fd.id
            WHERE fc.yield_per_hectare > 0 {region_filter}
            GROUP BY u.id, u.farm_name, fd.region
            ORDER BY total_production DESC
            LIMIT 100
        ''', params)
        
        results = []
        for row in cur.fetchall():
            result = dict(row)
            result['score'] = int(result['total_production'])
            result['details'] = {
                'avg_yield': float(result['avg_yield']),
                'total_area': float(result['total_area'])
            }
            results.append(result)
        
        return results


def get_dairy_champions(conn, region: str) -> List[dict]:
    '''Get "Молочный Чемпион" leaderboard'''
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        region_filter = ''
        params = []
        
        if region:
            region_filter = 'AND fd.region = %s'
            params.append(region)
        
        cur.execute(f'''
            SELECT 
                u.id as user_id,
                COALESCE(u.farm_name, 'Ферма №' || u.id) as farm_name,
                fd.region,
                AVG(fa.avg_milk_yield_per_head) as avg_milk_yield,
                SUM(fa.dairy_head_count) as total_heads,
                SUM(fa.dairy_head_count * fa.avg_milk_yield_per_head) as total_production,
                ROW_NUMBER() OVER (ORDER BY AVG(fa.avg_milk_yield_per_head) DESC) as rank
            FROM farmer_data fd
            JOIN users u ON u.id = fd.user_id
            JOIN farm_animals fa ON fa.farmer_data_id = fd.id
            WHERE fa.direction = 'Молочное' 
              AND fa.avg_milk_yield_per_head > 0 
              {region_filter}
            GROUP BY u.id, u.farm_name, fd.region
            ORDER BY avg_milk_yield DESC
            LIMIT 100
        ''', params)
        
        results = []
        for row in cur.fetchall():
            result = dict(row)
            result['score'] = int(result['avg_milk_yield'])
            result['details'] = {
                'total_heads': result['total_heads'],
                'total_production': int(result['total_production'])
            }
            results.append(result)
        
        return results


def get_meat_leaders(conn, region: str) -> List[dict]:
    '''Get "Мясной Лидер" leaderboard'''
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        region_filter = ''
        params = []
        
        if region:
            region_filter = 'AND fd.region = %s'
            params.append(region)
        
        cur.execute(f'''
            SELECT 
                u.id as user_id,
                COALESCE(u.farm_name, 'Ферма №' || u.id) as farm_name,
                fd.region,
                AVG(fa.avg_meat_yield_per_head) as avg_meat_yield,
                SUM(fa.meat_head_count) as total_heads,
                SUM(fa.meat_head_count * fa.avg_meat_yield_per_head) as total_production,
                ROW_NUMBER() OVER (ORDER BY AVG(fa.avg_meat_yield_per_head) DESC) as rank
            FROM farmer_data fd
            JOIN users u ON u.id = fd.user_id
            JOIN farm_animals fa ON fa.farmer_data_id = fd.id
            WHERE fa.direction = 'Мясное' 
              AND fa.avg_meat_yield_per_head > 0 
              {region_filter}
            GROUP BY u.id, u.farm_name, fd.region
            ORDER BY avg_meat_yield DESC
            LIMIT 100
        ''', params)
        
        results = []
        for row in cur.fetchall():
            result = dict(row)
            result['score'] = int(float(result['avg_meat_yield']))
            result['details'] = {
                'total_heads': result['total_heads'],
                'total_production': int(float(result['total_production']))
            }
            results.append(result)
        
        return results


def get_tech_farmers(conn, region: str) -> List[dict]:
    '''Get "Техно-Фермер" leaderboard'''
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        region_filter = ''
        params = []
        
        if region:
            region_filter = 'AND fd.region = %s'
            params.append(region)
        
        cur.execute(f'''
            SELECT 
                u.id as user_id,
                COALESCE(u.farm_name, 'Ферма №' || u.id) as farm_name,
                fd.region,
                fd.rating_technology as score,
                COUNT(fe.id) as equipment_count,
                AVG(fe.year) as avg_year,
                ROW_NUMBER() OVER (ORDER BY fd.rating_technology DESC) as rank
            FROM farmer_data fd
            JOIN users u ON u.id = fd.user_id
            LEFT JOIN farm_equipment fe ON fe.farmer_data_id = fd.id
            WHERE fd.rating_technology > 0 {region_filter}
            GROUP BY u.id, u.farm_name, fd.region, fd.rating_technology
            ORDER BY fd.rating_technology DESC
            LIMIT 100
        ''', params)
        
        results = []
        for row in cur.fetchall():
            result = dict(row)
            result['details'] = {
                'equipment_count': result['equipment_count'],
                'avg_year': int(result['avg_year']) if result['avg_year'] else 0
            }
            results.append(result)
        
        return results
