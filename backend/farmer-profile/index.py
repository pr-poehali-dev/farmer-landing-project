import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение полного профиля фермера для просмотра покупателями
    Args: event - dict с httpMethod, queryStringParameters (farmer_id)
    Returns: HTTP response с данными фермера
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    params = event.get('queryStringParameters', {}) or {}
    farmer_id = params.get('farmer_id')
    
    if not farmer_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется farmer_id'})
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL не настроен'})
        }
    
    schema = 't_p53065890_farmer_landing_proje'
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute(
            f"""SELECT u.id, u.name, u.email, u.phone, u.farm_name, u.bio,
                      fd.region
               FROM {schema}.users u
               LEFT JOIN {schema}.farmer_data fd ON u.id = fd.user_id
               WHERE u.id = %s AND u.role = 'farmer'""",
            (farmer_id,)
        )
        user_row = cur.fetchone()
        
        if not user_row:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Фермер не найден'})
            }
        
        cur.execute(
            f"""SELECT land_area, land_owned, land_rented, animals, equipment, crops,
                      employees_permanent, employees_seasonal
               FROM {schema}.farm_diagnostics
               WHERE user_id = %s""",
            (farmer_id,)
        )
        diag_row = cur.fetchone()
        
        farmer_data = {
            'id': user_row[0],
            'name': user_row[1],
            'email': user_row[2],
            'phone': user_row[3],
            'farm_name': user_row[4],
            'bio': user_row[5],
            'region': user_row[6]
        }
        
        if diag_row:
            farmer_data.update({
                'land_area': diag_row[0],
                'land_owned': diag_row[1],
                'land_rented': diag_row[2],
                'animals': diag_row[3] if diag_row[3] else [],
                'equipment': diag_row[4] if diag_row[4] else [],
                'crops': diag_row[5] if diag_row[5] else [],
                'employees_permanent': diag_row[6] or 0,
                'employees_seasonal': diag_row[7] or 0
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'farmer': farmer_data})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'})
        }
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
