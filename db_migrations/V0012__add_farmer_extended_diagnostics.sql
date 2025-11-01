-- Добавляем новые поля в таблицу farmer_data для расширенной диагностики
ALTER TABLE farmer_data 
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS assets JSONB DEFAULT '[]'::jsonb;

-- Добавляем новые поля в таблицу users для профиля
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Обновляем существующие записи, чтобы установить значения по умолчанию
UPDATE farmer_data SET country = 'Россия' WHERE country IS NULL;
UPDATE farmer_data SET assets = '[]'::jsonb WHERE assets IS NULL;

-- Комментарии для понимания структуры
COMMENT ON COLUMN farmer_data.country IS 'Страна фермерского хозяйства (Россия, Украина, Казахстан и т.д.)';
COMMENT ON COLUMN farmer_data.assets IS 'JSON массив активов: [{type: "animal/crop/beehive", name: "...", count: N, investment_types: [...], details: {...}}]';
COMMENT ON COLUMN users.first_name IS 'Имя пользователя';
COMMENT ON COLUMN users.last_name IS 'Фамилия пользователя';
COMMENT ON COLUMN users.phone IS 'Номер телефона пользователя';
