import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Recalculate ratings for all farmers
    Args: event - dict with httpMethod
          context - object with request_id
    Returns: HTTP response with recalculation results
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    conn = psycopg2.connect(dsn)
    schema = 't_p53065890_farmer_landing_proje'
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Получаем всех фермеров
            cur.execute(f'''
                SELECT u.id
                FROM {schema}.users u
                WHERE u.role = 'farmer'
            ''')
            farmers = cur.fetchall()
            
            results = []
            success_count = 0
            error_count = 0
            
            for farmer in farmers:
                farmer_id = farmer['id']
                
                try:
                    # Пересчитываем рейтинг для каждого фермера
                    rating = calculate_farmer_rating(cur, schema, farmer_id)
                    
                    # Сохраняем результаты
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
                        rating['productivity_score'],
                        rating['tech_score'],
                        rating['investment_score'],
                        rating['expertise_score'],
                        rating['community_score'],
                        rating['total_score'],
                        rating['level']
                    ))
                    
                    success_count += 1
                    results.append({
                        'farmer_id': farmer_id,
                        'status': 'success',
                        'rating': rating
                    })
                    
                except Exception as e:
                    import traceback
                    error_msg = f"{str(e)}\n{traceback.format_exc()}"
                    print(f"ERROR farmer {farmer_id}: {error_msg}")
                    error_count += 1
                    results.append({
                        'farmer_id': farmer_id,
                        'status': 'error',
                        'error': str(e)
                    })
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'total_farmers': len(farmers),
                    'success_count': success_count,
                    'error_count': error_count,
                    'results': results
                }),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Error: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        conn.close()


def calculate_farmer_rating(cur, schema: str, farmer_id: int) -> dict:
    '''Calculate rating for a single farmer'''
    
    # Получаем данные фермера
    cur.execute(f'''
        SELECT u.id, u.farm_name, u.first_name, u.last_name,
               fd.region, fd.country,
               fdiag.animals, fdiag.crops, fdiag.equipment,
               fdiag.land_area, fdiag.land_owned, fdiag.land_rented,
               fdiag.employees_permanent, fdiag.employees_seasonal
        FROM {schema}.users u
        LEFT JOIN {schema}.farmer_data fd ON u.id = fd.user_id
        LEFT JOIN {schema}.farm_diagnostics fdiag ON u.id = fdiag.user_id
        WHERE u.id = %s
    ''', (farmer_id,))
    
    farmer_data = cur.fetchone()
    
    if not farmer_data:
        raise Exception(f'Farmer {farmer_id} not found')
    
    # Конвертируем RealDictRow в обычный dict для удобства
    farmer_data = dict(farmer_data)
    
    # === 1. ПРОДУКТИВНОСТЬ ===
    productivity_score = 0
    
    # Безопасное получение данных (может быть None если нет farm_diagnostics)
    animals = farmer_data.get('animals') if farmer_data.get('animals') is not None else []
    crops = farmer_data.get('crops') if farmer_data.get('crops') is not None else []
    
    # Безопасная проверка типов данных
    if not isinstance(animals, list):
        animals = []
    if not isinstance(crops, list):
        crops = []
    
    for animal in animals:
        if not isinstance(animal, dict):
            continue
            
        animal_type = animal.get('type', '')
        count = animal.get('count', 0)
        
        # Безопасное преобразование count в int
        try:
            count = int(count) if count else 0
        except (ValueError, TypeError):
            count = 0
        
        direction = animal.get('direction', '')
        
        if animal_type == 'cows':
            if direction == 'dairy' or direction == 'mixed':
                milk_yield = animal.get('milkYield', 0)
                productivity_score += count * 50
                if milk_yield > 5000:
                    productivity_score += count * 20
            elif direction == 'meat':
                productivity_score += count * 40
        elif animal_type == 'pigs':
            productivity_score += count * 30
        elif animal_type == 'sheep':
            productivity_score += count * 25
        elif animal_type == 'goats':
            productivity_score += count * 25
        elif animal_type == 'chickens':
            productivity_score += count * 2
        elif animal_type == 'hives':
            productivity_score += count * 20
    
    for crop in crops:
        if not isinstance(crop, dict):
            continue
            
        area = crop.get('area', 0)
        crop_yield = crop.get('yield', 0)
        
        # Безопасное преобразование в числа
        try:
            area = float(area) if area else 0
        except (ValueError, TypeError):
            area = 0
        
        try:
            crop_yield = float(crop_yield) if crop_yield else 0
        except (ValueError, TypeError):
            crop_yield = 0
        
        productivity_score += int(area * 10)
        if crop_yield > 0:
            productivity_score += int(area * (crop_yield / 100))
    
    # === 2. ТЕХНОЛОГИЧНОСТЬ ===
    tech_score = 0
    
    equipment_list = farmer_data.get('equipment') if farmer_data.get('equipment') is not None else []
    
    # Безопасная проверка типа данных
    if not isinstance(equipment_list, list):
        equipment_list = []
    
    current_year = datetime.now().year
    
    for equip in equipment_list:
        if not isinstance(equip, dict):
            continue
        
        year = equip.get('year', current_year)
        
        # Безопасное преобразование года в int
        try:
            year_int = int(year) if year else current_year
        except (ValueError, TypeError):
            year_int = current_year
        
        age = current_year - year_int
        
        base_points = 100
        
        if age <= 2:
            age_coefficient = 2.0
        elif age <= 5:
            age_coefficient = 1.5
        elif age <= 10:
            age_coefficient = 1.2
        else:
            age_coefficient = 1.0
        
        tech_score += int(base_points * age_coefficient)
    
    # === 3. ИНВЕСТИЦИОННАЯ ПРИВЛЕКАТЕЛЬНОСТЬ ===
    investment_score = 0
    
    cur.execute(f'''
        SELECT COUNT(DISTINCT id) as offers_count, 
               COUNT(DISTINCT CASE WHEN status = 'published' THEN id END) as active_offers
        FROM {schema}.investment_offers
        WHERE farmer_id = %s
    ''', (farmer_id,))
    offers_data = cur.fetchone()
    
    if offers_data:
        offers_data = dict(offers_data)
        offers_count = offers_data.get('offers_count') or 0
        active_offers = offers_data.get('active_offers') or 0
        
        # Ограничиваем максимум 10 предложений для справедливого рейтинга
        offers_count = min(offers_count, 10)
        active_offers = min(active_offers, 10)
        
        print(f"DEBUG farmer {farmer_id}: DISTINCT offers={offers_count}, active={active_offers} (capped at 10)")
        investment_score += offers_count * 30
        investment_score += active_offers * 20
    
    try:
        cur.execute(f'''
            SELECT COUNT(DISTINCT i.id) as investments_count,
                   COALESCE(SUM(i.amount), 0) as total_invested
            FROM {schema}.investments i
            JOIN {schema}.investment_offers o ON i.offer_id = o.id
            WHERE o.farmer_id = %s AND i.status = 'active'
        ''', (farmer_id,))
        investments_data = cur.fetchone()
        
        if investments_data:
            investments_data = dict(investments_data)
            investment_score += (investments_data.get('investments_count') or 0) * 50
            total_invested = investments_data.get('total_invested') or 0
            investment_score += int(total_invested / 10000)
    except Exception:
        pass
    
    # === 4. ЭКСПЕРТНОСТЬ ===
    expertise_score = 0
    
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
    
    land_area = farmer_data.get('land_area')
    if land_area and land_area != '0':
        expertise_score += 20
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
    
    # === 5. СОЦИАЛЬНЫЙ КАПИТАЛ ===
    community_score = 0
    
    employees_permanent = farmer_data.get('employees_permanent') or 0
    employees_seasonal = farmer_data.get('employees_seasonal') or 0
    
    community_score += employees_permanent * 50
    community_score += employees_seasonal * 20
    
    if employees_permanent > 0:
        community_score += 50
    
    # === ИТОГО ===
    total_score = productivity_score + tech_score + investment_score + expertise_score + community_score
    
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
    
    return {
        'productivity_score': productivity_score,
        'tech_score': tech_score,
        'investment_score': investment_score,
        'expertise_score': expertise_score,
        'community_score': community_score,
        'total_score': total_score,
        'level': level
    }