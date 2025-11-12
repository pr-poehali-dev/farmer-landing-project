import json
import os
import psycopg2
from typing import Dict, Any, List, Tuple
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Recalculate all farmer ratings based on current diagnostics
    Args: event - dict with httpMethod
          context - object with request_id
    Returns: HTTP response with recalculation results
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            raise ValueError('DATABASE_URL not configured')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        schema = 't_p53065890_farmer_landing_proje'
        
        # Get all farmers with diagnostics and profiles
        query = f'''
            SELECT 
                u.id,
                u.region,
                fd.farm_name,
                diag.land_area,
                diag.land_owned,
                diag.land_rented,
                diag.animals,
                diag.equipment,
                diag.crops,
                diag.employees_permanent,
                diag.employees_seasonal
            FROM {schema}.users u
            LEFT JOIN {schema}.farmer_data fd ON u.id = fd.user_id
            LEFT JOIN {schema}.farm_diagnostics diag ON u.id = diag.user_id
            WHERE u.role = 'farmer'
        '''
        
        cur.execute(query)
        farmers = cur.fetchall()
        
        updated_count = 0
        results = []
        
        for farmer in farmers:
            user_id, region, farm_name, land_area, land_owned, land_rented, animals, equipment, crops, emp_perm, emp_seasonal = farmer
            
            # Prepare diagnostics dict
            diagnostics = {
                'land_area': float(land_area or 0),
                'land_owned': float(land_owned or 0),
                'land_rented': float(land_rented or 0),
                'animals': animals or [],
                'equipment': equipment or [],
                'crops': crops or [],
                'employees_permanent': emp_perm or 0,
                'employees_seasonal': emp_seasonal or 0
            }
            
            profile = {
                'region': region or '',
                'farm_name': farm_name or ''
            }
            
            # Calculate rating
            region_score, alpha_r = calculate_region_score(profile.get('region', ''))
            land_score, beta_l = calculate_land_score(diagnostics, profile.get('region', ''))
            animal_score, gamma_a = calculate_animal_score(diagnostics.get('animals', []))
            equipment_score, delta_e = calculate_equipment_score(diagnostics.get('equipment', []))
            crop_score, epsilon_c = calculate_crop_score(diagnostics.get('crops', []))
            staff_score, zeta_s = calculate_staff_score(diagnostics)
            finance_score, eta_f = calculate_finance_score(diagnostics)
            
            total_rating = (
                alpha_r * region_score +
                beta_l * land_score +
                gamma_a * animal_score +
                delta_e * equipment_score +
                epsilon_c * crop_score +
                zeta_s * staff_score +
                eta_f * finance_score
            )
            
            # Update farmer_scores table
            update_query = f'''
                INSERT INTO {schema}.farmer_scores (user_id, total_score, last_updated)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id) 
                DO UPDATE SET 
                    total_score = EXCLUDED.total_score,
                    last_updated = EXCLUDED.last_updated
            '''
            
            cur.execute(update_query, (str(user_id), int(total_rating), datetime.now()))
            updated_count += 1
            
            results.append({
                'userId': user_id,
                'farmName': farm_name or 'Без названия',
                'totalScore': int(total_rating)
            })
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'updatedCount': updated_count,
                'results': results[:10]  # Return first 10 for preview
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def calculate_region_score(region: str) -> Tuple[float, float]:
    northern_regions = [
        'Республика Саха (Якутия)', 'Магаданская область', 'Чукотский автономный округ',
        'Мурманская область', 'Ненецкий автономный округ', 'Ямало-Ненецкий автономный округ'
    ]
    
    siberia_far_east = [
        'Красноярский край', 'Иркутская область', 'Томская область', 'Новосибирская область',
        'Омская область', 'Кемеровская область', 'Хабаровский край', 'Приморский край',
        'Амурская область', 'Сахалинская область', 'Камчатский край'
    ]
    
    mountain_regions = [
        'Республика Алтай', 'Республика Дагестан', 'Кабардино-Балкарская Республика',
        'Карачаево-Черкесская Республика', 'Республика Северная Осетия — Алания',
        'Чеченская Республика', 'Республика Ингушетия'
    ]
    
    favorable_regions = {
        'Краснодарский край': 100,
        'Ростовская область': 95,
        'Воронежская область': 90,
        'Ставропольский край': 90,
        'Белгородская область': 85,
        'Тамбовская область': 80,
        'Саратовская область': 75,
        'Волгоградская область': 75,
        'Курская область': 70,
        'Липецкая область': 70,
        'Московская область': 65,
        'Ленинградская область': 60,
        'Алтайский край': 70,
        'Татарстан': 80,
        'Башкортостан': 75,
    }
    
    base_score = favorable_regions.get(region, 50)
    
    if region in northern_regions:
        coefficient = 1.2
    elif region in siberia_far_east:
        coefficient = 1.15
    elif region in mountain_regions:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return base_score, coefficient


def calculate_land_score(diagnostics: Dict[str, Any], region: str) -> Tuple[float, float]:
    land_area = float(diagnostics.get('land_area', 0))
    land_owned = float(diagnostics.get('land_owned', 0))
    
    if land_area == 0:
        return 0, 1.0
    
    area_score = min(100, (land_area / 100) * 50)
    ownership_ratio = land_owned / land_area if land_area > 0 else 0
    ownership_score = ownership_ratio * 50
    
    base_score = area_score + ownership_score
    
    poor_soil_regions = [
        'Архангельская область', 'Республика Коми', 'Мурманская область',
        'Ненецкий автономный округ', 'Ямало-Ненецкий автономный округ'
    ]
    
    medium_soil_regions = [
        'Ленинградская область', 'Новгородская область', 'Псковская область',
        'Вологодская область', 'Костромская область', 'Тверская область'
    ]
    
    if region in poor_soil_regions:
        coefficient = 1.2
    elif region in medium_soil_regions:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return base_score, coefficient


def calculate_animal_score(animals: List[Dict[str, Any]]) -> Tuple[float, float]:
    if not animals:
        return 0, 1.0
    
    total_score = 0
    has_rare_breed = False
    has_uncommon_breed = False
    
    rare_breeds = ['якутская', 'калмыцкая', 'казахская белоголовая', 'герефорд', 'абердин-ангус']
    uncommon_breeds = ['симментальская', 'шароле', 'лимузин', 'голштинская']
    
    animal_productivity = {
        'cows': {'base': 15, 'meat': 20, 'milk': 25, 'mixed': 22},
        'pigs': {'base': 12, 'meat': 18},
        'chickens': {'base': 8, 'meat': 10},
        'sheep': {'base': 10, 'meat': 12},
        'horses': {'base': 20},
        'deer': {'base': 18},
        'hives': {'base': 25}
    }
    
    for animal in animals:
        animal_type = animal.get('type', '')
        count = animal.get('count', 0)
        direction = animal.get('direction', 'other')
        breed = animal.get('breed', '').lower()
        
        if any(rare in breed for rare in rare_breeds):
            has_rare_breed = True
        elif any(uncommon in breed for uncommon in uncommon_breeds):
            has_uncommon_breed = True
        
        if animal_type in animal_productivity:
            base_value = animal_productivity[animal_type].get(direction, 
                         animal_productivity[animal_type].get('base', 10))
            
            productivity_bonus = 1.0
            if direction == 'milk' and animal.get('milkYield', 0) > 5000:
                productivity_bonus = 1.3
            elif direction == 'meat' and animal.get('meatYield', 0) > 300:
                productivity_bonus = 1.2
            
            total_score += (count / 10) * base_value * productivity_bonus
    
    total_score = min(100, total_score)
    
    if has_rare_breed:
        coefficient = 1.2
    elif has_uncommon_breed:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return total_score, coefficient


def calculate_equipment_score(equipment: List[Dict[str, Any]]) -> Tuple[float, float]:
    if not equipment:
        return 0, 1.2
    
    total_score = 0
    old_equipment_count = 0
    total_equipment = len(equipment)
    
    equipment_values = {
        'tractor': 25,
        'combine': 30,
        'plough': 15,
        'seeder': 20,
        'sprayer': 18,
        'trailer': 10,
        'other': 12
    }
    
    for item in equipment:
        eq_type = item.get('type', 'other')
        year = item.get('year', 2020)
        try:
            year = int(year) if year else 2020
        except (ValueError, TypeError):
            year = 2020
        attachments = item.get('attachments', [])
        
        base_value = equipment_values.get(eq_type, 12)
        
        age = 2024 - year
        age_penalty = 1.0 if age < 5 else 0.8 if age < 10 else 0.6
        
        if age > 15:
            old_equipment_count += 1
        
        attachment_bonus = 1.0 + (len(attachments) * 0.1)
        
        total_score += base_value * age_penalty * attachment_bonus
    
    total_score = min(100, total_score)
    
    old_ratio = old_equipment_count / total_equipment if total_equipment > 0 else 0
    coefficient = 1.2 if old_ratio > 0.5 else 1.0
    
    return total_score, coefficient


def calculate_crop_score(crops: List[Dict[str, Any]]) -> Tuple[float, float]:
    if not crops:
        return 0, 1.0
    
    total_score = 0
    
    crop_values = {
        'wheat': {'base': 20, 'high_yield': 30},
        'barley': {'base': 18, 'high_yield': 25},
        'corn': {'base': 22, 'high_yield': 32},
        'sunflower': {'base': 25, 'high_yield': 35},
        'potato': {'base': 20, 'high_yield': 28},
        'vegetables': {'base': 22, 'high_yield': 30},
        'fruits': {'base': 28, 'high_yield': 38},
        'other': {'base': 15, 'high_yield': 20}
    }
    
    yield_thresholds = {
        'wheat': 40,
        'barley': 35,
        'corn': 50,
        'sunflower': 20,
        'potato': 200,
        'vegetables': 250,
        'fruits': 150
    }
    
    for crop in crops:
        crop_type = crop.get('type', 'other')
        area = crop.get('area', 0)
        yield_per_ha = crop.get('yield', 0)
        
        crop_val = crop_values.get(crop_type, crop_values['other'])
        threshold = yield_thresholds.get(crop_type, 30)
        
        if yield_per_ha >= threshold:
            value = crop_val['high_yield']
        else:
            value = crop_val['base']
        
        total_score += (area / 10) * (value / 10)
    
    total_score = min(100, total_score)
    
    return total_score, 1.0


def calculate_staff_score(diagnostics: Dict[str, Any]) -> Tuple[float, float]:
    permanent = diagnostics.get('employees_permanent', 0)
    seasonal = diagnostics.get('employees_seasonal', 0)
    
    permanent_score = min(70, permanent * 10)
    seasonal_score = min(30, seasonal * 3)
    
    total_score = permanent_score + seasonal_score
    
    coefficient = 1.2 if permanent < 2 and seasonal < 3 else 1.0
    
    return total_score, coefficient


def calculate_finance_score(diagnostics: Dict[str, Any]) -> Tuple[float, float]:
    animals = diagnostics.get('animals', [])
    crops = diagnostics.get('crops', [])
    land_area = diagnostics.get('land_area', 0)
    
    animal_revenue = 0
    for animal in animals:
        animal_type = animal.get('type', '')
        count = animal.get('count', 0)
        
        revenue_per_unit = {
            'cows': 50000,
            'pigs': 15000,
            'chickens': 500,
            'sheep': 8000,
            'horses': 80000,
            'deer': 60000,
            'hives': 20000
        }
        
        animal_revenue += count * revenue_per_unit.get(animal_type, 5000)
    
    crop_revenue = 0
    for crop in crops:
        area = crop.get('area', 0)
        crop_type = crop.get('type', 'other')
        
        revenue_per_ha = {
            'wheat': 30000,
            'barley': 25000,
            'corn': 35000,
            'sunflower': 40000,
            'potato': 80000,
            'vegetables': 100000,
            'fruits': 150000,
            'other': 20000
        }
        
        crop_revenue += area * revenue_per_ha.get(crop_type, 20000)
    
    total_revenue = animal_revenue + crop_revenue
    
    score = min(100, (total_revenue / 1000000) * 20)
    
    return score, 1.0