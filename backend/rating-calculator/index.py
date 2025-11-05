import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Calculate comprehensive farmer rating with efficiency coefficients
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
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
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    user_id = event.get('headers', {}).get('X-User-Id') or event.get('headers', {}).get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'X-User-Id header required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'calculate':
            farmer_id = body_data.get('farmer_id', user_id)
            return calculate_rating(conn, farmer_id, headers)
    
    elif method == 'GET':
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'get_rating')
        
        if action == 'get_rating':
            farmer_id = params.get('farmer_id', user_id)
            return get_farmer_rating(conn, farmer_id, headers)
    
    conn.close()
    return {
        'statusCode': 400,
        'headers': headers,
        'body': json.dumps({'error': 'Invalid request'})
    }


def calculate_rating(conn, farmer_id: str, headers: dict) -> dict:
    '''Calculate comprehensive rating based on all farmer data'''
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Получаем базовую информацию фермера
        cur.execute('''
            SELECT * FROM farmer_data WHERE user_id = %s
        ''', (farmer_id,))
        farmer_data = cur.fetchone()
        
        if not farmer_data:
            conn.close()
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Farmer not found'})
            }
        
        region = farmer_data.get('region') or 'Россия'
        current_year = datetime.now().year
        
        # === 1. УРОЖАЙНОСТЬ (Yield Score) ===
        rating_yield = 0
        
        # Получаем культуры
        cur.execute('''
            SELECT * FROM farm_crops WHERE farmer_data_id = %s
        ''', (farmer_data['id'],))
        crops = cur.fetchall()
        
        for crop in crops:
            crop_name = crop['crop_name']
            actual_yield = float(crop['sowing_area']) * float(crop['gross_harvest']) if crop['gross_harvest'] else 0
            
            # Получаем среднюю урожайность по региону
            cur.execute('''
                SELECT avg_yield FROM regional_averages 
                WHERE region = %s AND crop_name = %s AND year = %s
            ''', (region, crop_name, current_year))
            avg_result = cur.fetchone()
            avg_yield = float(avg_result['avg_yield']) if avg_result and avg_result['avg_yield'] else 1.0
            
            # Коэффициент эффективности урожайности
            yield_coefficient = (float(crop['yield_per_hectare']) / avg_yield) if avg_yield > 0 and crop['yield_per_hectare'] else 1.0
            
            # Баллы: 1 балл за 1 га * коэффициент эффективности
            crop_points = float(crop['sowing_area']) * yield_coefficient * 10
            rating_yield += int(crop_points)
        
        # Животноводство - молочное
        cur.execute('''
            SELECT * FROM farm_animals 
            WHERE farmer_data_id = %s AND direction = 'Молочное'
        ''', (farmer_data['id'],))
        dairy_animals = cur.fetchall()
        
        for animal in dairy_animals:
            actual_yield = animal['avg_milk_yield_per_head'] or 0
            
            cur.execute('''
                SELECT avg_milk_yield FROM regional_averages 
                WHERE region = %s AND avg_milk_yield IS NOT NULL AND year = %s
            ''', (region, current_year))
            avg_result = cur.fetchone()
            avg_milk = avg_result['avg_milk_yield'] if avg_result and avg_result['avg_milk_yield'] else 5500
            
            milk_coefficient = (actual_yield / avg_milk) if avg_milk > 0 else 1.0
            dairy_points = (animal['dairy_head_count'] or 0) * milk_coefficient * 50
            rating_yield += int(dairy_points)
        
        # Животноводство - мясное
        cur.execute('''
            SELECT * FROM farm_animals 
            WHERE farmer_data_id = %s AND direction = 'Мясное'
        ''', (farmer_data['id'],))
        meat_animals = cur.fetchall()
        
        for animal in meat_animals:
            actual_yield = float(animal['avg_meat_yield_per_head']) if animal['avg_meat_yield_per_head'] else 0
            
            cur.execute('''
                SELECT avg_meat_yield FROM regional_averages 
                WHERE region = %s AND avg_meat_yield IS NOT NULL AND year = %s
            ''', (region, current_year))
            avg_result = cur.fetchone()
            avg_meat = float(avg_result['avg_meat_yield']) if avg_result and avg_result['avg_meat_yield'] else 250.0
            
            meat_coefficient = (actual_yield / avg_meat) if avg_meat > 0 else 1.0
            meat_points = (animal['meat_head_count'] or 0) * meat_coefficient * 40
            rating_yield += int(meat_points)
        
        # === 2. ТЕХНОЛОГИЧНОСТЬ (Technology Score) ===
        rating_technology = 0
        
        # Получаем технику
        cur.execute('''
            SELECT * FROM farm_equipment WHERE farmer_data_id = %s
        ''', (farmer_data['id'],))
        equipment = cur.fetchall()
        
        for tech in equipment:
            age = current_year - tech['year']
            # Коэффициент возраста: чем новее, тем выше
            age_coefficient = max(1.0, 2.0 - (age / 10))  # От 2.0 (новая) до 1.0 (старше 10 лет)
            tech_points = 100 * age_coefficient
            rating_technology += int(tech_points)
        
        # Бонус за использование агротехнологий
        cur.execute('''
            SELECT COUNT(DISTINCT fat.type) as tech_types_count
            FROM farm_agro_tech fat
            JOIN farm_crops fc ON fat.crop_id = fc.id
            WHERE fc.farmer_data_id = %s
        ''', (farmer_data['id'],))
        agro_tech_result = cur.fetchone()
        agro_tech_types = agro_tech_result['tech_types_count'] if agro_tech_result else 0
        rating_technology += agro_tech_types * 50
        
        # === 3. СОЦИАЛЬНЫЙ КАПИТАЛ (Social Score) ===
        rating_social = 0
        
        # Баллы за сотрудников
        employees_permanent = farmer_data.get('employees_permanent') or 0
        employees_seasonal = farmer_data.get('employees_seasonal') or 0
        rating_social += employees_permanent * 30
        rating_social += employees_seasonal * 10
        
        # Баллы за землю в собственности
        land_owned = float(farmer_data.get('land_owned') or 0)
        rating_social += int(land_owned * 5)
        
        # === 4. ИНВЕСТИЦИИ (Investment Score) ===
        rating_investment = 0
        
        # Проверяем инвестиции через платформу
        cur.execute('''
            SELECT COUNT(*) as count FROM investments 
            WHERE proposal_id IN (
                SELECT id FROM proposals WHERE user_id::TEXT = %s
            )
        ''', (farmer_id,))
        investment_result = cur.fetchone()
        investment_count = investment_result['count'] if investment_result else 0
        rating_investment += investment_count * 200
        
        # Бонус за новую технику (текущий год)
        cur.execute('''
            SELECT COUNT(*) as count FROM farm_equipment 
            WHERE farmer_data_id = %s AND year = %s
        ''', (farmer_data['id'], current_year))
        new_tech_result = cur.fetchone()
        new_tech_count = new_tech_result['count'] if new_tech_result else 0
        rating_investment += new_tech_count * 150
        
        # === 5. ПРОФЕССИОНАЛИЗМ (Professionalism Score) ===
        rating_professionalism = 0
        
        # Заполненность профиля
        profile_fields = [
            farmer_data.get('farm_name'),
            farmer_data.get('region'),
            farmer_data.get('land_owned'),
            farmer_data.get('land_rented')
        ]
        filled_count = sum(1 for field in profile_fields if field)
        rating_professionalism += filled_count * 25
        
        # Разнообразие деятельности
        has_crops = len(crops) > 0
        has_animals = len(dairy_animals) + len(meat_animals) > 0
        if has_crops and has_animals:
            rating_professionalism += 100  # Бонус за диверсификацию
        
        # Детализация данных
        cur.execute('''
            SELECT COUNT(*) as count FROM farm_agro_tech fat
            JOIN farm_crops fc ON fat.crop_id = fc.id
            WHERE fc.farmer_data_id = %s
        ''', (farmer_data['id'],))
        agro_detail_result = cur.fetchone()
        agro_detail_count = agro_detail_result['count'] if agro_detail_result else 0
        rating_professionalism += min(agro_detail_count * 20, 200)
        
        # === ИТОГОВЫЙ РЕЙТИНГ ===
        rating_total = rating_yield + rating_technology + rating_social + rating_investment + rating_professionalism
        
        # Обновляем рейтинг в базе
        cur.execute('''
            UPDATE farmer_data SET
                rating_yield = %s,
                rating_technology = %s,
                rating_social = %s,
                rating_investment = %s,
                rating_professionalism = %s,
                rating_total = %s,
                updated_at = NOW()
            WHERE id = %s
        ''', (rating_yield, rating_technology, rating_social, rating_investment, 
              rating_professionalism, rating_total, farmer_data['id']))
        
        conn.commit()
    
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'success': True,
            'rating': {
                'total': rating_total,
                'yield': rating_yield,
                'technology': rating_technology,
                'social': rating_social,
                'investment': rating_investment,
                'professionalism': rating_professionalism
            }
        })
    }


def get_farmer_rating(conn, farmer_id: str, headers: dict) -> dict:
    '''Get farmer rating breakdown'''
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT 
                rating_total,
                rating_yield,
                rating_technology,
                rating_social,
                rating_investment,
                rating_professionalism,
                updated_at
            FROM farmer_data 
            WHERE user_id = %s
        ''', (farmer_id,))
        
        rating = cur.fetchone()
        
        if not rating:
            conn.close()
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Farmer not found'})
            }
    
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(dict(rating), default=str)
    }
