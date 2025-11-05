import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage detailed farmer data (animals, crops, equipment, employees)
    Args: event - dict with httpMethod, body, headers (X-User-Id)
          context - object with request_id
    Returns: HTTP response with farmer data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    headers_dict = event.get('headers', {})
    user_id = headers_dict.get('X-User-Id') or headers_dict.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Authorization required'})
        }
    
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            return get_farmer_data(conn, user_id)
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'save_land':
                return save_land(conn, user_id, body_data)
            elif action == 'save_employees':
                return save_employees(conn, user_id, body_data)
            elif action == 'add_animal':
                return add_animal(conn, user_id, body_data)
            elif action == 'add_crop':
                return add_crop(conn, user_id, body_data)
            elif action == 'add_agro_tech':
                return add_agro_tech(conn, user_id, body_data)
            elif action == 'add_equipment':
                return add_equipment(conn, user_id, body_data)
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            entity_type = params.get('type')
            entity_id = params.get('id')
            
            if entity_type and entity_id:
                return delete_entity(conn, user_id, entity_type, entity_id)
    
    finally:
        conn.close()
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid request'})
    }


def get_farmer_data_id(conn, user_id: str) -> int:
    '''Get or create farmer_data record'''
    with conn.cursor() as cur:
        cur.execute('SELECT id FROM farmer_data WHERE user_id = %s', (user_id,))
        result = cur.fetchone()
        
        if result:
            return result[0]
        
        cur.execute('INSERT INTO farmer_data (user_id) VALUES (%s) RETURNING id', (user_id,))
        new_id = cur.fetchone()[0]
        conn.commit()
        return new_id


def get_farmer_data(conn, user_id: str) -> dict:
    '''Get all farmer data with related entities'''
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT * FROM farmer_data WHERE user_id = %s', (user_id,))
        farmer_data = cur.fetchone()
        
        if not farmer_data:
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'land_owned': 0,
                    'land_rented': 0,
                    'employees_permanent': 0,
                    'employees_seasonal': 0,
                    'animals': [],
                    'crops': [],
                    'equipment': [],
                    'rating': {}
                })
            }
        
        farmer_data_id = farmer_data['id']
        
        cur.execute('SELECT * FROM farm_animals WHERE farmer_data_id = %s', (farmer_data_id,))
        animals = [dict(row) for row in cur.fetchall()]
        
        cur.execute('SELECT * FROM farm_crops WHERE farmer_data_id = %s', (farmer_data_id,))
        crops_raw = cur.fetchall()
        crops = []
        for crop in crops_raw:
            crop_dict = dict(crop)
            crop_id = crop_dict['id']
            
            cur.execute('SELECT * FROM farm_agro_tech WHERE crop_id = %s', (crop_id,))
            agro_tech = [dict(row) for row in cur.fetchall()]
            crop_dict['agro_tech'] = agro_tech
            crops.append(crop_dict)
        
        cur.execute('SELECT * FROM farm_equipment WHERE farmer_data_id = %s', (farmer_data_id,))
        equipment = [dict(row) for row in cur.fetchall()]
        
        response_data = {
            'land_owned': float(farmer_data['land_owned']) if farmer_data['land_owned'] else 0,
            'land_rented': float(farmer_data['land_rented']) if farmer_data['land_rented'] else 0,
            'employees_permanent': farmer_data['employees_permanent'] or 0,
            'employees_seasonal': farmer_data['employees_seasonal'] or 0,
            'animals': animals,
            'crops': crops,
            'equipment': equipment,
            'rating': {
                'total': farmer_data['rating_total'] or 0,
                'yield': farmer_data['rating_yield'] or 0,
                'technology': farmer_data['rating_technology'] or 0,
                'social': farmer_data['rating_social'] or 0,
                'investment': farmer_data['rating_investment'] or 0,
                'professionalism': farmer_data['rating_professionalism'] or 0
            }
        }
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(response_data, default=str)
    }


def save_land(conn, user_id: str, data: dict) -> dict:
    '''Save land ownership data'''
    land_owned = data.get('land_owned', 0)
    land_rented = data.get('land_rented', 0)
    
    farmer_data_id = get_farmer_data_id(conn, user_id)
    
    with conn.cursor() as cur:
        cur.execute('''
            UPDATE farmer_data 
            SET land_owned = %s, land_rented = %s, updated_at = NOW()
            WHERE id = %s
        ''', (land_owned, land_rented, farmer_data_id))
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }


def save_employees(conn, user_id: str, data: dict) -> dict:
    '''Save employees data'''
    employees_permanent = data.get('employees_permanent', 0)
    employees_seasonal = data.get('employees_seasonal', 0)
    
    farmer_data_id = get_farmer_data_id(conn, user_id)
    
    with conn.cursor() as cur:
        cur.execute('''
            UPDATE farmer_data 
            SET employees_permanent = %s, employees_seasonal = %s, updated_at = NOW()
            WHERE id = %s
        ''', (employees_permanent, employees_seasonal, farmer_data_id))
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }


def add_animal(conn, user_id: str, data: dict) -> dict:
    '''Add animal record'''
    farmer_data_id = get_farmer_data_id(conn, user_id)
    
    with conn.cursor() as cur:
        cur.execute('''
            INSERT INTO farm_animals 
            (farmer_data_id, category, direction, breed, dairy_head_count, 
             avg_milk_yield_per_head, meat_head_count, avg_meat_yield_per_head)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
        ''', (
            farmer_data_id,
            data.get('category', ''),
            data.get('direction', ''),
            data.get('breed', ''),
            data.get('dairy_head_count'),
            data.get('avg_milk_yield_per_head'),
            data.get('meat_head_count'),
            data.get('avg_meat_yield_per_head')
        ))
        animal_id = cur.fetchone()[0]
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'animal_id': animal_id})
    }


def add_crop(conn, user_id: str, data: dict) -> dict:
    '''Add crop record'''
    farmer_data_id = get_farmer_data_id(conn, user_id)
    
    sowing_area = float(data.get('sowing_area', 0))
    gross_harvest = float(data.get('gross_harvest', 0))
    yield_per_hectare = gross_harvest / sowing_area if sowing_area > 0 else 0
    
    with conn.cursor() as cur:
        cur.execute('''
            INSERT INTO farm_crops 
            (farmer_data_id, crop_name, sowing_area, gross_harvest, yield_per_hectare)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        ''', (farmer_data_id, data.get('crop_name', ''), sowing_area, gross_harvest, yield_per_hectare))
        crop_id = cur.fetchone()[0]
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'crop_id': crop_id})
    }


def add_agro_tech(conn, user_id: str, data: dict) -> dict:
    '''Add agro technology record'''
    crop_id = data.get('crop_id')
    
    if not crop_id:
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'crop_id required'})
        }
    
    with conn.cursor() as cur:
        cur.execute('''
            INSERT INTO farm_agro_tech (crop_id, type, name, application_rate)
            VALUES (%s, %s, %s, %s) RETURNING id
        ''', (crop_id, data.get('type', ''), data.get('name', ''), data.get('application_rate', 0)))
        agro_tech_id = cur.fetchone()[0]
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'agro_tech_id': agro_tech_id})
    }


def add_equipment(conn, user_id: str, data: dict) -> dict:
    '''Add equipment record'''
    farmer_data_id = get_farmer_data_id(conn, user_id)
    
    with conn.cursor() as cur:
        cur.execute('''
            INSERT INTO farm_equipment (farmer_data_id, brand, model, year)
            VALUES (%s, %s, %s, %s) RETURNING id
        ''', (farmer_data_id, data.get('brand', ''), data.get('model', ''), data.get('year', 2020)))
        equipment_id = cur.fetchone()[0]
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'equipment_id': equipment_id})
    }


def delete_entity(conn, user_id: str, entity_type: str, entity_id: str) -> dict:
    '''Delete entity (animal, crop, equipment)'''
    farmer_data_id = get_farmer_data_id(conn, user_id)
    
    table_map = {
        'animal': 'farm_animals',
        'crop': 'farm_crops',
        'equipment': 'farm_equipment'
    }
    
    table_name = table_map.get(entity_type)
    if not table_name:
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid entity type'})
        }
    
    with conn.cursor() as cur:
        cur.execute(f'''
            UPDATE {table_name} SET updated_at = NOW() 
            WHERE id = %s AND farmer_data_id = %s
        ''', (entity_id, farmer_data_id))
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }
