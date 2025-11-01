# Инструкция по удалению пользователей

## Быстрое удаление через API

Используйте эту команду curl для удаления пользователей по их ID:

```bash
curl -X POST 'https://functions.poehali.dev/68b32d82-8055-4ae6-b41c-28ff4dad404b' \
  -H 'X-Admin-Secret: farmer_admin_2025_secret_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_ids": [1, 2, 3]
  }'
```

### Как узнать ID пользователя?

Выполните SQL-запрос в базе данных:

```sql
SELECT id, email, role, created_at 
FROM t_p53065890_farmer_landing_proje.users 
ORDER BY id;
```

### Удаление конкретных пользователей

Например, чтобы удалить пользователей с email `iliakrasnopeev@yandex.ru`:

1. Найдите их ID:
```sql
SELECT id, email FROM t_p53065890_farmer_landing_proje.users 
WHERE LOWER(email) = 'iliakrasnopeev@yandex.ru';
```

2. Удалите через API, подставив найденные ID:
```bash
curl -X POST 'https://functions.poehali.dev/68b32d82-8055-4ae6-b41c-28ff4dad404b' \
  -H 'X-Admin-Secret: farmer_admin_2025_secret_key' \
  -H 'Content-Type: application/json' \
  -d '{"user_ids": [5, 8]}'
```

## Что удаляется?

Функция автоматически удалит ВСЕ связанные данные пользователя из таблиц:
- investments (инвестиции)
- proposals (предложения)
- products (продукты)
- ads (объявления)
- farmer_data (данные фермера)
- garage (гараж)
- leaderboard (таблица лидеров)
- users (сам пользователь)

## Безопасность

- Требуется admin secret: `farmer_admin_2025_secret_key`
- Без секрета запрос вернёт ошибку 403
- Удаление необратимо - данные восстановить невозможно
