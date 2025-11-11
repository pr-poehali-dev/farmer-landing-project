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
    '''Calculate comprehensive rating based on farm_diagnostics data'''
    
    schema = 't_p53065890_farmer_landing_proje'
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Получаем данные из farm_diagnostics
        cur.execute(f'''
            SELECT u.id, u.farm_name, u.first_name, u.last_name,
                   fd.region, fd.country,
                   fdiag.animals, fdiag.crops, fdiag.equipment,
                   fdiag.land_area, fdiag.land_owned, fdiag.land_rented,
                   fdiag.employees_permanent, fdiag.employees_seasonal
            FROM {schema}.users u
            LEFT JOIN {schema}.farmer_data fd ON u.id = fd.user_id
            LEFT JOIN {schema}.farm_diagnostics fdiag ON u.id = fdiag.user_id
            WHERE u.id = %s AND u.role = 'farmer'
        ''', (int(farmer_id),))
        farmer_data = cur.fetchone()
        
        if not farmer_data:
            conn.close()
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Farmer not found'})
            }
        
        # === 1. ПРОДУКТИВНОСТЬ (Productivity Score) ===
        productivity_score = 0
        
        animals = farmer_data.get('animals') or []
        crops = farmer_data.get('crops') or []
        
        # Баллы за животных
        for animal in animals:
            animal_type = animal.get('type', '')
            count = animal.get('count', 0)
            direction = animal.get('direction', '')
            milk_price = animal.get('milkPrice', 0)
            meat_price = animal.get('meatPrice', 0)
            egg_price = animal.get('eggPrice', 0)
            
            if animal_type == 'cows':
                if direction == 'dairy' or direction == 'mixed':
                    milk_yield = animal.get('milkYield', 0)
                    productivity_score += count * 50
                    if milk_yield > 5000:
                        productivity_score += count * 20
                    # Бонус за цену молока (выше средней 35 руб/л)
                    if milk_price > 35:
                        productivity_score += count * int((milk_price - 35) / 5)
                elif direction == 'meat':
                    productivity_score += count * 40
                    # Бонус за цену мяса (выше средней 450 руб/кг)
                    if meat_price > 450:
                        productivity_score += count * int((meat_price - 450) / 50)
            elif animal_type == 'pigs':
                productivity_score += count * 30
                if meat_price > 350:
                    productivity_score += count * int((meat_price - 350) / 50)
            elif animal_type == 'sheep':
                productivity_score += count * 25
                if meat_price > 400:
                    productivity_score += count * int((meat_price - 400) / 50)
            elif animal_type == 'goats':
                productivity_score += count * 25
            elif animal_type == 'chickens':
                productivity_score += count * 2
                # Бонус за цену яиц (выше средней 80 руб/10шт)
                if egg_price > 80:
                    productivity_score += count * int((egg_price - 80) / 20)
            elif animal_type == 'hives':
                productivity_score += count * 20
        
        # Баллы за посевы
        for crop in crops:
            area = crop.get('area', 0)
            crop_yield = crop.get('yield', 0)
            price_per_kg = crop.get('pricePerKg', 0)
            
            # 10 баллов за гектар + бонус за урожайность
            productivity_score += int(area * 10)
            if crop_yield > 0:
                productivity_score += int(area * (crop_yield / 100))
            
            # Бонус за цену реализации (выше средней 25 руб/кг)
            if price_per_kg > 25:
                productivity_score += int(area * (price_per_kg - 25) / 10)
        
        # === 2. ТЕХНОЛОГИЧНОСТЬ (Tech Score) ===
        tech_score = 0
        
        equipment_list = farmer_data.get('equipment') or []
        current_year = datetime.now().year
        
        for equip in equipment_list:
            year = equip.get('year', current_year)
            age = current_year - year
            
            # Базовые баллы за технику
            base_points = 100
            
            # Коэффициент возраста: чем новее, тем выше
            if age <= 2:
                age_coefficient = 2.0
            elif age <= 5:
                age_coefficient = 1.5
            elif age <= 10:
                age_coefficient = 1.2
            else:
                age_coefficient = 1.0
            
            tech_score += int(base_points * age_coefficient)
        
        # === 3. ИНВЕСТИЦИОННАЯ ПРИВЛЕКАТЕЛЬНОСТЬ (Investment Score) ===
        investment_score = 0
        
        # Проверяем наличие инвестиционных предложений
        cur.execute(f'''
            SELECT COUNT(DISTINCT id) as offers_count, 
                   COUNT(DISTINCT CASE WHEN status = 'published' THEN id END) as active_offers
            FROM {schema}.investment_offers
            WHERE farmer_id = %s
        ''', (int(farmer_id),))
        offers_data = cur.fetchone()
        
        if offers_data:
            offers_count = min(offers_data.get('offers_count', 0), 10)
            active_offers = min(offers_data.get('active_offers', 0), 10)
            investment_score += offers_count * 30
            investment_score += active_offers * 20
        
        # Проверяем активные инвестиции
        cur.execute(f'''
            SELECT COUNT(DISTINCT i.id) as investments_count,
                   COALESCE(SUM(i.amount), 0) as total_invested
            FROM {schema}.investments i
            JOIN {schema}.investment_offers o ON i.offer_id = o.id
            WHERE o.farmer_id = %s AND i.status = 'active'
        ''', (int(farmer_id),))
        investments_data = cur.fetchone()
        
        if investments_data:
            investment_score += investments_data.get('investments_count', 0) * 50
            # Бонус за объем инвестиций (1 балл за каждые 10000 руб)
            total_invested = investments_data.get('total_invested', 0)
            investment_score += int(total_invested / 10000)
        
        # === 4. ЭКСПЕРТНОСТЬ (Expertise Score) ===
        expertise_score = 0
        
        # Баллы за заполненность профиля
        if farmer_data.get('farm_name'):
            expertise_score += 10
        if farmer_data.get('first_name'):
            expertise_score += 10
        if farmer_data.get('last_name'):
            expertise_score += 10
        if farmer_data.get('region'):
            expertise_score += 15
        if farmer_data.get('country'):
            expertise_score += 5
        
        # Баллы за данные хозяйства
        land_area = farmer_data.get('land_area')
        if land_area and land_area != '0':
            expertise_score += 20
            # Бонус за объем земли
            try:
                area_num = float(land_area)
                if area_num > 100:
                    expertise_score += 15
                elif area_num > 50:
                    expertise_score += 10
                elif area_num > 10:
                    expertise_score += 5
            except:
                pass
        
        if len(animals) > 0:
            expertise_score += 20
        if len(crops) > 0:
            expertise_score += 15
        if len(equipment_list) > 0:
            expertise_score += 15
        
        # === 5. СОЦИАЛЬНЫЙ КАПИТАЛ (Community Score) ===
        community_score = 0
        
        # Баллы за сотрудников
        employees_permanent = farmer_data.get('employees_permanent') or 0
        employees_seasonal = farmer_data.get('employees_seasonal') or 0
        
        community_score += employees_permanent * 50
        community_score += employees_seasonal * 20
        
        # Бонус за масштаб хозяйства
        if employees_permanent > 0:
            community_score += 50
        
        # === ИТОГОВЫЙ РЕЙТИНГ ===
        total_score = productivity_score + tech_score + investment_score + expertise_score + community_score
        
        # Определяем уровень
        if total_score >= 1000:
            level = 5
        elif total_score >= 500:
            level = 4
        elif total_score >= 250:
            level = 3
        elif total_score >= 100:
            level = 2
        else:
            level = 1
        
        # Сохраняем результаты в farmer_scores
        cur.execute(f'''
            INSERT INTO {schema}.farmer_scores 
            (user_id, productivity_score, tech_score, investment_score, 
             expertise_score, community_score, total_score, level, last_updated)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET
                productivity_score = EXCLUDED.productivity_score,
                tech_score = EXCLUDED.tech_score,
                investment_score = EXCLUDED.investment_score,
                expertise_score = EXCLUDED.expertise_score,
                community_score = EXCLUDED.community_score,
                total_score = EXCLUDED.total_score,
                level = EXCLUDED.level,
                last_updated = CURRENT_TIMESTAMP
        ''', (
            str(farmer_id),
            productivity_score,
            tech_score,
            investment_score,
            expertise_score,
            community_score,
            total_score,
            level
        ))
        
        conn.commit()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'rating': {
                    'productivity_score': productivity_score,
                    'tech_score': tech_score,
                    'investment_score': investment_score,
                    'expertise_score': expertise_score,
                    'community_score': community_score,
                    'total_score': total_score,
                    'level': level
                }
            })
        }


def get_farmer_rating(conn, farmer_id: str, headers: dict) -> dict:
    '''Get existing farmer rating'''
    
    schema = 't_p53065890_farmer_landing_proje'
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f'''
            SELECT user_id, productivity_score, tech_score, investment_score,
                   expertise_score, community_score, total_score, level
            FROM {schema}.farmer_scores WHERE user_id = %s
        ''', (str(farmer_id),))
        
        rating = cur.fetchone()
        
        conn.close()
        
        if not rating:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Rating not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'rating': dict(rating)
            })
        }