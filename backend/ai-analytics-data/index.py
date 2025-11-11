import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Load farm data and regional statistics for AI analytics
    Args: event with httpMethod, queryStringParameters (userId)
          context with request_id attribute
    Returns: HTTP response with farmData and regionalStats
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Get userId from query params
    params = event.get('queryStringParameters', {})
    user_id = params.get('userId')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'userId is required'})
        }
    
    # Connect to database
    database_url = os.environ.get('DATABASE_URL', '')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get user data
        cur.execute(
            "SELECT region FROM users WHERE id = %s",
            (user_id,)
        )
        user_row = cur.fetchone()
        
        if not user_row:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'User not found'})
            }
        
        region = user_row['region'] or 'Не указан'
        
        # Get farm diagnosis
        cur.execute(
            "SELECT diagnosis FROM farm_diagnosis WHERE user_id = %s ORDER BY created_at DESC LIMIT 1",
            (user_id,)
        )
        diagnosis_row = cur.fetchone()
        
        farm_data = {
            'region': region,
            'landArea': 0,
            'landOwned': 0,
            'landRented': 0,
            'animals': [],
            'crops': [],
            'equipment': [],
            'employeesPermanent': 0,
            'employeesSeasonal': 0
        }
        
        if diagnosis_row:
            diagnosis = diagnosis_row['diagnosis']
            assets = diagnosis.get('assets', [{}])[0]
            
            farm_data['landArea'] = float(assets.get('land_area', 0) or 0)
            farm_data['landOwned'] = float(assets.get('land_owned', 0) or 0)
            farm_data['landRented'] = float(assets.get('land_rented', 0) or 0)
            farm_data['animals'] = assets.get('animals', [])
            farm_data['crops'] = assets.get('crops', [])
            farm_data['equipment'] = assets.get('equipment', [])
            farm_data['employeesPermanent'] = int(assets.get('employees_permanent', 0) or 0)
            farm_data['employeesSeasonal'] = int(assets.get('employees_seasonal', 0) or 0)
        
        # Calculate regional statistics (mock data for now)
        regional_stats = {
            'avgLandArea': 150,
            'avgAnimals': 50,
            'avgYield': 35,
            'avgEmployees': 8
        }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'farmData': farm_data,
                'regionalStats': regional_stats
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
