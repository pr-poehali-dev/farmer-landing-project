import json
import os
from typing import Dict, Any, List
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Calculate comprehensive farmer rating based on diagnostics and profile
    Args: event - dict with httpMethod, headers (X-User-Id)
          context - object with request_id
    Returns: HTTP response with rating breakdown
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
        
        region_score = calculate_region_score(profile.get('region', ''))
        land_score = calculate_land_score(diagnostics)
        animal_score = calculate_animal_score(diagnostics.get('animals', []))
        equipment_score = calculate_equipment_score(diagnostics.get('equipment', []))
        crop_score = calculate_crop_score(diagnostics.get('crops', []))
        staff_score = calculate_staff_score(diagnostics)
        finance_score = calculate_finance_score(diagnostics)
        
        weights = {
            'region': 0.10,
            'land': 0.20,
            'animal': 0.20,
            'equipment': 0.15,
            'crop': 0.15,
            'staff': 0.10,
            'finance': 0.10
        }
        
        total_rating = (
            region_score * weights['region'] +
            land_score * weights['land'] +
            animal_score * weights['animal'] +
            equipment_score * weights['equipment'] +
            crop_score * weights['crop'] +
            staff_score * weights['staff'] +
            finance_score * weights['finance']
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
                'weights': weights
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def calculate_region_score(region: str) -> float:
    region_bonuses = {
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
        'Новосибирская область': 65,
        'Омская область': 60,
        'Татарстан': 80,
        'Башкортостан': 75,
    }
    return region_bonuses.get(region, 50)


def calculate_land_score(diagnostics: Dict[str, Any]) -> float:
    land_area = float(diagnostics.get('land_area', 0))
    land_owned = float(diagnostics.get('land_owned', 0))
    land_rented = float(diagnostics.get('land_rented', 0))
    
    if land_area == 0:
        return 0
    
    area_score = min(100, (land_area / 100) * 50)
    ownership_ratio = land_owned / land_area if land_area > 0 else 0
    ownership_score = ownership_ratio * 50
    
    return area_score + ownership_score


def calculate_animal_score(animals: List[Dict[str, Any]]) -> float:
    if not animals:
        return 0
    
    total_score = 0
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
        
        if animal_type in animal_productivity:
            base_value = animal_productivity[animal_type].get(direction, 
                         animal_productivity[animal_type].get('base', 10))
            
            productivity_bonus = 1.0
            if direction == 'milk' and animal.get('milkYield', 0) > 5000:
                productivity_bonus = 1.3
            elif direction == 'meat' and animal.get('meatYield', 0) > 300:
                productivity_bonus = 1.2
            
            total_score += (count / 10) * base_value * productivity_bonus
    
    return min(100, total_score)


def calculate_equipment_score(equipment: List[Dict[str, Any]]) -> float:
    if not equipment:
        return 0
    
    current_year = datetime.now().year
    total_score = 0
    
    for item in equipment:
        year = int(item.get('year', current_year))
        age = current_year - year
        
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
    
    return min(100, total_score)


def calculate_crop_score(crops: List[Dict[str, Any]]) -> float:
    if not crops:
        return 0
    
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
        
        if area > 0 and crop_yield > 0:
            benchmark_yield = crop_benchmarks.get(crop_type, 3.5)
            actual_yield_per_ha = crop_yield / area
            yield_ratio = actual_yield_per_ha / benchmark_yield
            
            price_factor = min(2.0, price_per_kg / 10)
            
            crop_score = yield_ratio * area * price_factor * 5
            total_score += crop_score
    
    return min(100, total_score)


def calculate_staff_score(diagnostics: Dict[str, Any]) -> float:
    permanent = diagnostics.get('employees_permanent', 0)
    seasonal = diagnostics.get('employees_seasonal', 0)
    
    permanent_score = min(70, permanent * 7)
    seasonal_score = min(30, seasonal * 2)
    
    return permanent_score + seasonal_score


def calculate_finance_score(diagnostics: Dict[str, Any]) -> float:
    animals = diagnostics.get('animals', [])
    crops = diagnostics.get('crops', [])
    
    total_revenue_potential = 0
    
    for animal in animals:
        count = animal.get('count', 0)
        direction = animal.get('direction', 'other')
        
        if direction == 'milk':
            milk_yield = animal.get('milkYield', 4000)
            milk_price = animal.get('milkPrice', 35)
            total_revenue_potential += count * milk_yield * milk_price / 1000
        elif direction == 'meat':
            meat_yield = animal.get('meatYield', 250)
            meat_price = animal.get('meatPrice', 300)
            total_revenue_potential += count * meat_yield * meat_price / 1000
    
    for crop in crops:
        crop_yield = crop.get('yield', 0)
        price_per_kg = crop.get('pricePerKg', 10)
        total_revenue_potential += crop_yield * price_per_kg / 1000
    
    if total_revenue_potential > 10000:
        return 100
    elif total_revenue_potential > 5000:
        return 85
    elif total_revenue_potential > 1000:
        return 70
    elif total_revenue_potential > 500:
        return 50
    elif total_revenue_potential > 100:
        return 30
    else:
        return 10
