import json
import os
from datetime import datetime, date
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage farmer rating system with 5 categories
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'get_scores')
        
        if action == 'get_scores':
            return get_farmer_scores(conn, user_id, headers)
        elif action == 'leaderboard':
            category = params.get('category', 'total')
            period = params.get('period', 'all-time')
            return get_leaderboard(conn, category, period, headers)
        elif action == 'daily_quests':
            return get_daily_quests(conn, user_id, headers)
        elif action == 'achievements':
            return get_achievements(conn, user_id, headers)
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'calculate_scores':
            return calculate_and_update_scores(conn, user_id, headers)
        elif action == 'complete_quest':
            quest_id = body_data.get('quest_id')
            return complete_quest(conn, user_id, quest_id, headers)
        elif action == 'unlock_achievement':
            achievement_id = body_data.get('achievement_id')
            return unlock_achievement(conn, user_id, achievement_id, headers)
    
    conn.close()
    return {
        'statusCode': 400,
        'headers': headers,
        'body': json.dumps({'error': 'Invalid request'})
    }


def get_farmer_scores(conn, user_id: str, headers: dict) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT * FROM farmer_scores WHERE user_id = %s
        ''', (user_id,))
        scores = cur.fetchone()
        
        if not scores:
            cur.execute('''
                INSERT INTO farmer_scores (user_id) VALUES (%s)
                RETURNING *
            ''', (user_id,))
            scores = cur.fetchone()
            conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(dict(scores), default=str)
    }


def calculate_and_update_scores(conn, user_id: str, headers: dict) -> dict:
    schema = 't_p53065890_farmer_landing_proje'
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        try:
            cur.execute(f'''
                SELECT land_owned, land_rented, animals, equipment, crops, 
                       employees_permanent, employees_seasonal
                FROM {schema}.farm_diagnostics 
                WHERE CAST(user_id AS TEXT) = %s
            ''', (str(user_id),))
            
            farm_data = cur.fetchone()
            
            if not farm_data:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'profileId': user_id,
                        'scores': {
                            'overall': 0,
                            'nominations': {'crop_master': 0, 'livestock_champion': 0, 'agro_innovator': 0},
                            'categories_normalized': {
                                'land_power': 0, 'livestock_efficiency': 0, 'crop_mastery': 0,
                                'tech_advancement': 0, 'business_scale': 0
                            }
                        }
                    })
                }
            
            land_owned = float(farm_data.get('land_owned') or 0)
            land_rented = float(farm_data.get('land_rented') or 0)
            animals = farm_data.get('animals') or []
            crops = farm_data.get('crops') or []
            equipment = farm_data.get('equipment') or []
            permanent = int(farm_data.get('employees_permanent') or 0)
            seasonal = int(farm_data.get('employees_seasonal') or 0)
            
            land_power = (land_owned * 1.5) + (land_rented * 0.8)
            
            livestock_efficiency = 0.0
            for animal in animals:
                direction = animal.get('direction', 'other')
                count = animal.get('count', 0)
                if direction == 'milk':
                    milk_yield = animal.get('milkYield', 0)
                    efficiency_ratio = milk_yield / 6000.0 if milk_yield > 0 else 0
                    livestock_efficiency += efficiency_ratio * count * 1.2
                elif direction == 'meat':
                    meat_yield = animal.get('meatYield', 0)
                    efficiency_ratio = meat_yield / 300.0 if meat_yield > 0 else 0
                    livestock_efficiency += efficiency_ratio * count
            
            crop_mastery = 0.0
            for crop in crops:
                area = crop.get('area', 0)
                crop_yield = crop.get('yield', 0)
                if area > 0:
                    calculated_yield = crop_yield / area
                    benchmark_yield = 3.5
                    yield_ratio = calculated_yield / benchmark_yield
                    crop_mastery += yield_ratio * area
            
            current_year = datetime.now().year
            tech_advancement = 0.0
            for item in equipment:
                year = int(item.get('year', current_year))
                age = current_year - year
                age_decay_factor = 0.95 ** age
                tech_advancement += 100 * age_decay_factor
            
            business_scale = (permanent * 10) + (seasonal * 4)
            
            max_scores = {'land_power': 1000, 'livestock_efficiency': 1000, 'crop_mastery': 1000, 
                          'tech_advancement': 1000, 'business_scale': 200}
            
            normalized = {}
            for key in ['land_power', 'livestock_efficiency', 'crop_mastery', 'tech_advancement', 'business_scale']:
                raw_val = locals()[key]
                max_val = max_scores[key]
                normalized[key] = (raw_val / max_val * 1000) if max_val > 0 else 0
            
            overall_score = (
                normalized['land_power'] * 0.15 +
                normalized['livestock_efficiency'] * 0.25 +
                normalized['crop_mastery'] * 0.25 +
                normalized['tech_advancement'] * 0.20 +
                normalized['business_scale'] * 0.15
            )
            
            crop_master = (normalized['crop_mastery'] * 0.60 + normalized['land_power'] * 0.25 + 
                           normalized['tech_advancement'] * 0.15)
            livestock_champion = (normalized['livestock_efficiency'] * 0.70 + normalized['business_scale'] * 0.20 + 
                                  normalized['land_power'] * 0.10)
            agro_innovator = (normalized['tech_advancement'] * 0.50 + normalized['crop_mastery'] * 0.30 + 
                              normalized['livestock_efficiency'] * 0.20)
            
            result = {
                'profileId': user_id,
                'scores': {
                    'overall': overall_score,
                    'nominations': {
                        'crop_master': crop_master,
                        'livestock_champion': livestock_champion,
                        'agro_innovator': agro_innovator
                    },
                    'categories_normalized': normalized
                }
            }
            
            conn.close()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(result)
            }
            
        except Exception as e:
            conn.close()
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': str(e)})
            }


def get_leaderboard(conn, category: str, period: str, headers: dict) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        try:
            cur.execute('''
                INSERT INTO farmer_scores (user_id)
                SELECT CAST(fd.user_id AS TEXT)
                FROM farmer_data fd
                WHERE CAST(fd.user_id AS TEXT) NOT IN (SELECT user_id FROM farmer_scores)
                ON CONFLICT (user_id) DO NOTHING
            ''')
            conn.commit()
        except:
            conn.rollback()
        
        score_column = 'total_score'
        if category == 'productivity':
            score_column = 'productivity_score'
        elif category == 'tech':
            score_column = 'tech_score'
        elif category == 'investment':
            score_column = 'investment_score'
        elif category == 'expertise':
            score_column = 'expertise_score'
        elif category == 'community':
            score_column = 'community_score'
        
        cur.execute(f'''
            SELECT 
                fs.user_id,
                u.name as full_name,
                COALESCE(NULLIF(u.farm_name, ''), 'Ферма №' || fs.user_id) as farm_name,
                COALESCE(NULLIF(u.bio, ''), 'Регион не указан') as region,
                {score_column} as score,
                fs.level,
                ROW_NUMBER() OVER (ORDER BY {score_column} DESC, fs.user_id) as rank
            FROM farmer_scores fs
            LEFT JOIN users u ON u.id::TEXT = fs.user_id
            ORDER BY {score_column} DESC, fs.user_id
            LIMIT 100
        ''')
        
        leaderboard_raw = cur.fetchall()
        leaderboard = [dict(entry) for entry in leaderboard_raw]
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps([dict(row) for row in leaderboard], default=str)
    }


def get_daily_quests(conn, user_id: str, headers: dict) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT * FROM daily_quests
            WHERE user_id = %s AND quest_date = CURRENT_DATE
            ORDER BY created_at
        ''', (user_id,))
        
        quests = cur.fetchall()
        
        if not quests:
            quest_templates = [
                {'type': 'update_farm', 'name': 'Обновите информацию о хозяйстве', 'points': 50},
                {'type': 'add_proposal', 'name': 'Создайте новое предложение', 'points': 30},
                {'type': 'check_equipment', 'name': 'Проверьте состояние техники', 'points': 20}
            ]
            
            for template in quest_templates:
                cur.execute('''
                    INSERT INTO daily_quests (user_id, quest_type, quest_name, points)
                    VALUES (%s, %s, %s, %s)
                    RETURNING *
                ''', (user_id, template['type'], template['name'], template['points']))
            
            conn.commit()
            
            cur.execute('''
                SELECT * FROM daily_quests
                WHERE user_id = %s AND quest_date = CURRENT_DATE
            ''', (user_id,))
            quests = cur.fetchall()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps([dict(q) for q in quests], default=str)
    }


def complete_quest(conn, user_id: str, quest_id: int, headers: dict) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE daily_quests
            SET completed = TRUE
            WHERE id = %s AND user_id = %s AND completed = FALSE
            RETURNING points
        ''', (quest_id, user_id))
        
        result = cur.fetchone()
        
        if result:
            points = result['points']
            cur.execute('''
                UPDATE farmer_scores
                SET total_score = total_score + %s
                WHERE user_id = %s
            ''', (points, user_id))
            conn.commit()
            
            conn.close()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'points_earned': points})
            }
    
    conn.close()
    return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps({'error': 'Quest not found or already completed'})
    }


def get_achievements(conn, user_id: str, headers: dict) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT * FROM achievements ORDER BY points')
        all_achievements = cur.fetchall()
        
        cur.execute('''
            SELECT achievements FROM farmer_scores WHERE user_id = %s
        ''', (user_id,))
        
        result = cur.fetchone()
        unlocked_ids = result['achievements'] if result and result['achievements'] else []
    
    conn.close()
    
    achievements_list = []
    for ach in all_achievements:
        ach_dict = dict(ach)
        ach_dict['earned'] = ach['id'] in unlocked_ids
        achievements_list.append(ach_dict)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(achievements_list, default=str)
    }


def unlock_achievement(conn, user_id: str, achievement_id: int, headers: dict) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT achievements FROM farmer_scores WHERE user_id = %s
        ''', (user_id,))
        
        result = cur.fetchone()
        current_achievements = result['achievements'] if result and result['achievements'] else []
        
        if achievement_id not in current_achievements:
            current_achievements.append(achievement_id)
            
            cur.execute('''
                UPDATE farmer_scores
                SET achievements = %s
                WHERE user_id = %s
            ''', (json.dumps(current_achievements), user_id))
            
            cur.execute('SELECT points FROM achievements WHERE id = %s', (achievement_id,))
            ach_result = cur.fetchone()
            
            if ach_result:
                points = ach_result['points']
                cur.execute('''
                    UPDATE farmer_scores
                    SET total_score = total_score + %s
                    WHERE user_id = %s
                ''', (points, user_id))
            
            conn.commit()
            
            conn.close()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'points_earned': points if ach_result else 0})
            }
    
    conn.close()
    return {
        'statusCode': 400,
        'headers': headers,
        'body': json.dumps({'error': 'Achievement already unlocked'})
    }