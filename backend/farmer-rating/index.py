import json
import os
from typing import Dict, Any, List, Tuple
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Calculate comprehensive farmer rating with difficulty coefficients
    Args: event - dict with httpMethod, headers (X-User-Id)
          context - object with request_id
    Returns: HTTP response with rating breakdown and coefficients
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
        body = json.loads(event.get('body', '{}'))
        diagnostics = body.get('diagnostics', {})
        profile = body.get('profile', {})
        
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
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'totalRating': round(total_rating, 1),
                'breakdown': {
                    'region': round(region_score, 1),
                    'land': round(land_score, 1),
                    'animal': round(animal_score, 1),
                    'equipment': round(equipment_score, 1),
                    'crop': round(crop_score, 1),
                    'staff': round(staff_score, 1),
                    'finance': round(finance_score, 1)
                },
                'coefficients': {
                    'region': alpha_r,
                    'land': beta_l,
                    'animal': gamma_a,
                    'equipment': delta_e,
                    'crop': epsilon_c,
                    'staff': zeta_s,
                    'finance': eta_f
                },
                'weighted': {
                    'region': round(alpha_r * region_score, 1),
                    'land': round(beta_l * land_score, 1),
                    'animal': round(gamma_a * animal_score, 1),
                    'equipment': round(delta_e * equipment_score, 1),
                    'crop': round(epsilon_c * crop_score, 1),
                    'staff': round(zeta_s * staff_score, 1),
                    'finance': round(eta_f * finance_score, 1)
                }
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
    
    base_score = min(100, total_score)
    
    if has_rare_breed:
        coefficient = 1.2
    elif has_uncommon_breed:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return base_score, coefficient


def calculate_equipment_score(equipment: List[Dict[str, Any]]) -> Tuple[float, float]:
    if not equipment:
        return 0, 1.2
    
    current_year = datetime.now().year
    total_score = 0
    avg_age = 0
    
    for item in equipment:
        year = int(item.get('year', current_year))
        age = current_year - year
        avg_age += age
        
        if age <= 3:
            age_score = 20
        elif age <= 7:
            age_score = 15
        elif age <= 15:
            age_score = 10
        else:
            age_score = 5
        
        has_attachments = bool(item.get('attachments', '').strip())
        attachment_bonus = 5 if has_attachments else 0
        
        total_score += age_score + attachment_bonus
    
    base_score = min(100, total_score)
    avg_age = avg_age / len(equipment) if equipment else 0
    
    if avg_age > 15:
        coefficient = 1.2
    elif avg_age > 7:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return base_score, coefficient


def calculate_crop_score(crops: List[Dict[str, Any]]) -> Tuple[float, float]:
    if not crops:
        return 0, 1.0
    
    complex_crops = ['garlic', 'rapeseed', 'soy']
    moderate_crops = ['beet', 'cabbage']
    
    has_complex = False
    has_moderate = False
    
    crop_benchmarks = {
        'beet': 45.0,
        'cabbage': 35.0,
        'rapeseed': 2.5,
        'soy': 2.0,
        'corn': 8.0,
        'garlic': 15.0,
        'other': 3.5
    }
    
    total_score = 0
    
    for crop in crops:
        crop_type = crop.get('type', 'other')
        area = crop.get('area', 0)
        crop_yield = crop.get('yield', 0)
        price_per_kg = crop.get('pricePerKg', 10)
        
        if crop_type in complex_crops:
            has_complex = True
        elif crop_type in moderate_crops:
            has_moderate = True
        
        if area > 0 and crop_yield > 0:
            benchmark_yield = crop_benchmarks.get(crop_type, 3.5)
            actual_yield_per_ha = crop_yield / area
            yield_ratio = actual_yield_per_ha / benchmark_yield
            
            price_factor = min(2.0, price_per_kg / 10)
            
            crop_score = yield_ratio * area * price_factor * 5
            total_score += crop_score
    
    base_score = min(100, total_score)
    
    if has_complex:
        coefficient = 1.2
    elif has_moderate:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return base_score, coefficient


def calculate_staff_score(diagnostics: Dict[str, Any]) -> Tuple[float, float]:
    permanent = diagnostics.get('employees_permanent', 0)
    seasonal = diagnostics.get('employees_seasonal', 0)
    
    permanent_score = min(70, permanent * 7)
    seasonal_score = min(30, seasonal * 2)
    
    base_score = permanent_score + seasonal_score
    
    if permanent < 3:
        coefficient = 1.2
    elif permanent < 7:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return base_score, coefficient


def calculate_finance_score(diagnostics: Dict[str, Any]) -> Tuple[float, float]:
    animals = diagnostics.get('animals', [])
    crops = diagnostics.get('crops', [])
    
    total_revenue_potential = 0
    avg_price_level = 0
    price_count = 0
    
    for animal in animals:
        count = animal.get('count', 0)
        direction = animal.get('direction', 'other')
        
        if direction == 'milk':
            milk_yield = animal.get('milkYield', 4000)
            milk_price = animal.get('milkPrice', 35)
            total_revenue_potential += count * milk_yield * milk_price / 1000
            avg_price_level += milk_price
            price_count += 1
        elif direction == 'meat':
            meat_yield = animal.get('meatYield', 250)
            meat_price = animal.get('meatPrice', 300)
            total_revenue_potential += count * meat_yield * meat_price / 1000
            avg_price_level += meat_price / 10
            price_count += 1
    
    for crop in crops:
        crop_yield = crop.get('yield', 0)
        price_per_kg = crop.get('pricePerKg', 10)
        total_revenue_potential += crop_yield * price_per_kg / 1000
        avg_price_level += price_per_kg
        price_count += 1
    
    if total_revenue_potential > 10000:
        base_score = 100
    elif total_revenue_potential > 5000:
        base_score = 85
    elif total_revenue_potential > 1000:
        base_score = 70
    elif total_revenue_potential > 500:
        base_score = 50
    elif total_revenue_potential > 100:
        base_score = 30
    else:
        base_score = 10
    
    avg_price = avg_price_level / price_count if price_count > 0 else 20
    
    if avg_price < 15:
        coefficient = 1.2
    elif avg_price < 30:
        coefficient = 1.1
    else:
        coefficient = 1.0
    
    return base_score, coefficient
