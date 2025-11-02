import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для бизнес-метрик админ-панели (DAU/MAU, Revenue, Churn, регионы)
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с request_id
    Returns: HTTP response с метриками или ошибкой
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
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL не настроен'})
        }
    
    schema = 't_p53065890_farmer_landing_proje'
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            metric_type = params.get('type', 'all')
            
            now = datetime.now()
            today = now.date()
            month_ago = today - timedelta(days=30)
            week_ago = today - timedelta(days=7)
            
            metrics = {}
            
            if metric_type in ['all', 'users']:
                cur.execute(f"""
                    SELECT COUNT(DISTINCT id) 
                    FROM {schema}.users 
                    WHERE DATE(created_at) = %s
                """, (today,))
                dau = cur.fetchone()[0]
                
                cur.execute(f"""
                    SELECT COUNT(DISTINCT id) 
                    FROM {schema}.users 
                    WHERE created_at >= %s
                """, (month_ago,))
                mau = cur.fetchone()[0]
                
                cur.execute(f"""
                    SELECT role, COUNT(*) 
                    FROM {schema}.users 
                    GROUP BY role
                """)
                users_by_role = dict(cur.fetchall())
                
                cur.execute(f"""
                    SELECT DATE(created_at) as day, COUNT(*) as count
                    FROM {schema}.users
                    WHERE created_at >= %s
                    GROUP BY DATE(created_at)
                    ORDER BY day DESC
                    LIMIT 30
                """, (month_ago,))
                
                daily_signups = []
                for row in cur.fetchall():
                    daily_signups.append({
                        'date': row[0].isoformat(),
                        'count': row[1]
                    })
                
                metrics['users'] = {
                    'dau': dau,
                    'mau': mau,
                    'total': sum(users_by_role.values()),
                    'by_role': users_by_role,
                    'daily_signups': daily_signups
                }
            
            if metric_type in ['all', 'financial']:
                cur.execute(f"""
                    SELECT 
                        COUNT(*) as total_investments,
                        COALESCE(SUM(amount), 0) as total_revenue,
                        COALESCE(AVG(amount), 0) as avg_investment
                    FROM {schema}.investments
                """)
                inv_row = cur.fetchone()
                
                cur.execute(f"""
                    SELECT DATE(date) as day, COALESCE(SUM(amount), 0) as revenue
                    FROM {schema}.investments
                    WHERE date >= %s
                    GROUP BY DATE(date)
                    ORDER BY day DESC
                    LIMIT 30
                """, (month_ago,))
                
                daily_revenue = []
                for row in cur.fetchall():
                    daily_revenue.append({
                        'date': row[0].isoformat(),
                        'revenue': float(row[1])
                    })
                
                metrics['financial'] = {
                    'total_investments': inv_row[0],
                    'total_revenue': float(inv_row[1]),
                    'avg_investment': float(inv_row[2]),
                    'daily_revenue': daily_revenue
                }
            
            if metric_type in ['all', 'proposals']:
                cur.execute(f"""
                    SELECT 
                        COUNT(*) as total,
                        COUNT(*) FILTER (WHERE status = 'active') as active,
                        COUNT(*) FILTER (WHERE created_at >= %s) as recent
                    FROM {schema}.proposals
                """, (week_ago,))
                prop_row = cur.fetchone()
                
                cur.execute(f"""
                    SELECT type, COUNT(*) 
                    FROM {schema}.proposals 
                    GROUP BY type
                """)
                proposals_by_type = dict(cur.fetchall())
                
                cur.execute(f"""
                    SELECT DATE(created_at) as day, COUNT(*) as count
                    FROM {schema}.proposals
                    WHERE created_at >= %s
                    GROUP BY DATE(created_at)
                    ORDER BY day DESC
                    LIMIT 30
                """, (month_ago,))
                
                daily_proposals = []
                for row in cur.fetchall():
                    daily_proposals.append({
                        'date': row[0].isoformat(),
                        'count': row[1]
                    })
                
                metrics['proposals'] = {
                    'total': prop_row[0],
                    'active': prop_row[1],
                    'recent_week': prop_row[2],
                    'by_type': proposals_by_type,
                    'daily_proposals': daily_proposals
                }
            
            if metric_type in ['all', 'regions']:
                cur.execute(f"""
                    SELECT 
                        fd.region, 
                        COUNT(DISTINCT fd.user_id) as user_count,
                        COUNT(DISTINCT p.id) as proposal_count
                    FROM {schema}.farmer_data fd
                    LEFT JOIN {schema}.proposals p ON fd.user_id = p.user_id
                    WHERE fd.region IS NOT NULL AND fd.region != ''
                    GROUP BY fd.region
                    ORDER BY user_count DESC
                    LIMIT 10
                """)
                
                top_regions = []
                for row in cur.fetchall():
                    top_regions.append({
                        'name': row[0],
                        'users': row[1],
                        'proposals': row[2]
                    })
                
                metrics['regions'] = {
                    'top_regions': top_regions
                }
            
            if metric_type in ['all', 'engagement']:
                cur.execute(f"""
                    SELECT 
                        COALESCE(AVG(gamification_points), 0) as avg_points,
                        MAX(gamification_points) as max_points
                    FROM {schema}.farmer_data
                    WHERE gamification_points > 0
                """)
                gamif_row = cur.fetchone()
                
                cur.execute(f"""
                    SELECT COUNT(DISTINCT user_id) 
                    FROM {schema}.proposals 
                    WHERE created_at >= %s
                """, (week_ago,))
                active_farmers = cur.fetchone()[0]
                
                cur.execute(f"""
                    SELECT COUNT(DISTINCT user_id) 
                    FROM {schema}.investments 
                    WHERE date >= %s
                """, (week_ago,))
                active_investors = cur.fetchone()[0]
                
                metrics['engagement'] = {
                    'avg_gamification_points': float(gamif_row[0]) if gamif_row else 0,
                    'max_gamification_points': gamif_row[1] if gamif_row else 0,
                    'active_farmers_week': active_farmers,
                    'active_investors_week': active_investors
                }
            
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(metrics)
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    except Exception as e:
        if conn:
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }