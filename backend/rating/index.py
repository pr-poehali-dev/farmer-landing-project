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
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        proposal_count = 0
        profile_filled = 0
        investment_count = 0
        
        try:
            cur.execute('SELECT COUNT(*) as count FROM proposals WHERE CAST(user_id AS TEXT) = %s', (user_id,))
            result = cur.fetchone()
            if result:
                proposal_count = result['count']
        except:
            pass
        
        try:
            cur.execute('SELECT COUNT(*) as count FROM farmer_data WHERE user_id = %s AND farm_name IS NOT NULL', (user_id,))
            result = cur.fetchone()
            if result:
                profile_filled = result['count']
        except:
            pass
        
        try:
            cur.execute('''
                SELECT COUNT(*) as count 
                FROM investments 
                WHERE proposal_id IN (
                    SELECT id FROM proposals WHERE CAST(user_id AS TEXT) = %s
                )
            ''', (user_id,))
            result = cur.fetchone()
            if result:
                investment_count = result['count']
        except:
            pass
        
        productivity_score = proposal_count * 30
        tech_score = profile_filled * 20
        investment_score = investment_count * 50
        expertise_score = min(proposal_count * 10, 100)
        community_score = investment_count * 15
        
        total_score = productivity_score + tech_score + investment_score + expertise_score + community_score
        
        level = 1
        if total_score >= 1000:
            level = 5
        elif total_score >= 500:
            level = 4
        elif total_score >= 250:
            level = 3
        elif total_score >= 100:
            level = 2
        
        cur.execute('''
            INSERT INTO farmer_scores (
                user_id, productivity_score, tech_score, investment_score,
                expertise_score, community_score, total_score, level
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id) 
            DO UPDATE SET
                productivity_score = EXCLUDED.productivity_score,
                tech_score = EXCLUDED.tech_score,
                investment_score = EXCLUDED.investment_score,
                expertise_score = EXCLUDED.expertise_score,
                community_score = EXCLUDED.community_score,
                total_score = EXCLUDED.total_score,
                level = EXCLUDED.level,
                last_updated = NOW()
            RETURNING *
        ''', (user_id, productivity_score, tech_score, investment_score,
              expertise_score, community_score, total_score, level))
        
        updated_scores = cur.fetchone()
        conn.commit()
    
    conn.close()
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(dict(updated_scores), default=str)
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
            LEFT JOIN users u ON u.id = CAST(fs.user_id AS INTEGER)
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