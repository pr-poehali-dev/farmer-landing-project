'''
Business: Отправка письма для сброса пароля через SMTP
Args: event - dict с httpMethod, body (email пользователя)
      context - object с request_id
Returns: HTTP response dict
'''
import json
import os
import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    # Handle CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    # Получаем email из запроса
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '').strip().lower()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email обязателен'})
        }
    
    # Подключение к БД
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Проверяем существование пользователя
    cur.execute("SELECT id, name FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    
    if not user:
        # Для безопасности возвращаем успех даже если email не найден
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Если email существует, письмо отправлено'})
        }
    
    # Генерируем токен сброса
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(hours=1)
    
    # Сохраняем токен в БД
    cur.execute(
        "INSERT INTO password_resets (user_id, token, expires_at) VALUES (%s, %s, %s)",
        (user['id'], reset_token, expires_at)
    )
    conn.commit()
    cur.close()
    conn.close()
    
    # Отправка письма через SMTP
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    frontend_url = os.environ.get('FRONTEND_URL', 'https://фармер.рф')
    
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    
    # Формируем письмо
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Сброс пароля - Фармер.рф'
    msg['From'] = smtp_user
    msg['To'] = email
    
    text_content = f"""
Здравствуйте, {user['name']}!

Вы запросили сброс пароля на платформе Фармер.рф.

Перейдите по ссылке для создания нового пароля:
{reset_link}

Ссылка действительна в течение 1 часа.

Если вы не запрашивали сброс пароля, проигнорируйте это письмо.

С уважением,
Команда Фармер.рф
"""
    
    html_content = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d5016;">Сброс пароля</h2>
        <p>Здравствуйте, {user['name']}!</p>
        <p>Вы запросили сброс пароля на платформе <strong>Фармер.рф</strong>.</p>
        <p>Перейдите по ссылке для создания нового пароля:</p>
        <p style="margin: 30px 0;">
            <a href="{reset_link}" 
               style="background-color: #2d5016; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Сбросить пароль
            </a>
        </p>
        <p style="color: #666; font-size: 14px;">Ссылка действительна в течение 1 часа.</p>
        <p style="color: #666; font-size: 14px;">
            Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
            С уважением,<br>
            Команда Фармер.рф
        </p>
    </div>
</body>
</html>
"""
    
    part1 = MIMEText(text_content, 'plain', 'utf-8')
    part2 = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(part1)
    msg.attach(part2)
    
    # Отправляем письмо
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'message': 'Письмо для сброса пароля отправлено'})
    }
