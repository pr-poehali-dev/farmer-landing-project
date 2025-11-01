-- Добавление колонки farm_name в таблицу users
ALTER TABLE users ADD COLUMN IF NOT EXISTS farm_name TEXT DEFAULT '';