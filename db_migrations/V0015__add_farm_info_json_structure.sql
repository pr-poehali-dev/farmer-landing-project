-- Добавление структурированных JSON-полей для ИИ-анализа и новой архитектуры кабинета фермера

-- Добавляем farm_info (объединяет всю информацию о ферме для ИИ)
ALTER TABLE t_p53065890_farmer_landing_proje.farmer_data 
ADD COLUMN IF NOT EXISTS farm_info JSONB DEFAULT '{
  "assets": [],
  "garage": {"equipment": [], "fertilizers": []},
  "social_links": {"vk": "", "telegram": "", "instagram": ""},
  "main_activity": "",
  "activity_description": ""
}'::jsonb;

-- Добавляем флаг для ИИ-анализа
ALTER TABLE t_p53065890_farmer_landing_proje.farmer_data 
ADD COLUMN IF NOT EXISTS analyzable BOOLEAN DEFAULT true;

-- Добавляем баллы геймификации
ALTER TABLE t_p53065890_farmer_landing_proje.farmer_data 
ADD COLUMN IF NOT EXISTS gamification_points INTEGER DEFAULT 0;

-- Добавляем прогресс заполнения профиля (для UI)
ALTER TABLE t_p53065890_farmer_landing_proje.farmer_data 
ADD COLUMN IF NOT EXISTS profile_completion_percent INTEGER DEFAULT 0;

-- Расширяем таблицу users для профиля владельца
ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);

ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Комментарии для документации JSON-структуры
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.farmer_data.farm_info IS 
'JSON структура: {
  "assets": [{"type": "cow|crop|bee|...", "name": "string", "count": number, "details": "string"}],
  "garage": {
    "equipment": [{"type": "tractor|combine|...", "brand": "string", "model": "string", "year": number}],
    "fertilizers": [{"type": "string", "brand": "string", "usage": "string"}]
  },
  "social_links": {"vk": "url", "telegram": "url", "instagram": "url"},
  "main_activity": "plant_growing|animal_farming|mixed",
  "activity_description": "text"
}';
