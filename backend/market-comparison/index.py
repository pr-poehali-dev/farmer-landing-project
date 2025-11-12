import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Compare farmer's animals and crops with other farmers who have same breeds/types
    Args: event - dict with httpMethod, headers (X-User-Id)
          context - object with request_id
    Returns: HTTP response with detailed market comparison per animal/crop
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
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        headers = event.get('headers') or {}
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'User ID required'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'DATABASE_URL not configured'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        schema = 't_p53065890_farmer_landing_proje'
        
        my_query = f'''
            SELECT diag.animals, diag.crops
            FROM {schema}.farm_diagnostics diag
            WHERE diag.user_id = {user_id}
            LIMIT 1
        '''
        
        cur.execute(my_query)
        my_row = cur.fetchone()
        
        if not my_row:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'animals': [],
                    'crops': []
                })
            }
        
        my_animals, my_crops = my_row
        my_animals = my_animals or []
        my_crops = my_crops or []
        
        all_query = f'''
            SELECT user_id, animals, crops
            FROM {schema}.farm_diagnostics
            WHERE user_id != {user_id}
        '''
        
        cur.execute(all_query)
        all_farmers = cur.fetchall()
        
        animal_comparisons = []
        for my_animal in my_animals:
            animal_type = my_animal.get('type', '')
            breed = my_animal.get('breed', '')
            direction = my_animal.get('direction', '')
            my_count = my_animal.get('count', 0)
            my_meat_yield = my_animal.get('meatYield', 0)
            my_milk_yield = my_animal.get('milkYield', 0)
            my_price_per_kg = my_animal.get('pricePerKg', 0) or my_animal.get('meatPrice', 0)
            
            matching_animals = []
            for farmer_id, animals, crops in all_farmers:
                if not animals:
                    continue
                for animal in animals:
                    other_type = animal.get('type', '')
                    if (other_type == animal_type or 
                        other_type.rstrip('s') == animal_type.rstrip('s') or
                        (other_type == 'cow' and animal_type == 'cows') or
                        (other_type == 'cows' and animal_type == 'cow')):
                        if breed and animal.get('breed', ''):
                            if animal.get('breed', '').lower() == breed.lower():
                                matching_animals.append(animal)
                        elif not breed and not animal.get('breed', ''):
                            matching_animals.append(animal)
            
            avg_meat_yield = sum(a.get('meatYield', 0) for a in matching_animals) / len(matching_animals) if matching_animals else 0
            avg_milk_yield = sum(a.get('milkYield', 0) for a in matching_animals) / len(matching_animals) if matching_animals else 0
            avg_price = sum(a.get('pricePerKg', 0) or a.get('meatPrice', 0) for a in matching_animals) / len(matching_animals) if matching_animals else 0
            
            animal_comparisons.append({
                'type': animal_type,
                'breed': breed,
                'direction': direction,
                'count': my_count,
                'myMeatYield': my_meat_yield,
                'avgMeatYield': round(avg_meat_yield, 1) if matching_animals else 0,
                'myMilkYield': my_milk_yield,
                'avgMilkYield': round(avg_milk_yield, 1) if matching_animals else 0,
                'myPrice': my_price_per_kg,
                'avgPrice': round(avg_price, 2) if matching_animals else 0,
                'farmersCount': len(matching_animals)
            })
        
        crop_comparisons = []
        for my_crop in my_crops:
            crop_type = my_crop.get('type', '')
            my_area = my_crop.get('area', 0)
            my_yield = my_crop.get('yield', 0)
            my_price = my_crop.get('pricePerUnit', 0)
            
            matching_crops = []
            for farmer_id, animals, crops in all_farmers:
                if not crops:
                    continue
                for crop in crops:
                    if crop.get('type') == crop_type:
                        matching_crops.append(crop)
            
            if matching_crops:
                avg_yield = sum(c.get('yield', 0) for c in matching_crops) / len(matching_crops) if matching_crops else 0
                avg_price = sum(c.get('pricePerUnit', 0) for c in matching_crops) / len(matching_crops) if matching_crops else 0
                
                crop_comparisons.append({
                    'type': crop_type,
                    'area': my_area,
                    'myYield': my_yield,
                    'avgYield': round(avg_yield, 1),
                    'myPrice': my_price,
                    'avgPrice': round(avg_price, 2),
                    'farmersCount': len(matching_crops)
                })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'animals': animal_comparisons,
                'crops': crop_comparisons
            })
        }
        
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e), 'traceback': traceback.format_exc()})
        }