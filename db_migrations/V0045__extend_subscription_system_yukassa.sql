-- Расширение системы подписок для полноценной оплаты

-- Обновляем subscription_plans - добавляем фичи и лимиты
ALTER TABLE t_p53065890_farmer_landing_proje.subscription_plans 
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS max_proposals INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Обновляем существующие планы с правильными данными
UPDATE t_p53065890_farmer_landing_proje.subscription_plans 
SET 
  features = '["Диагностика хозяйства", "Просмотр рейтинга", "1 объявление"]'::jsonb,
  max_proposals = 1,
  duration_days = 30
WHERE tier = 'free';

UPDATE t_p53065890_farmer_landing_proje.subscription_plans 
SET 
  features = '["Все из Free", "До 5 объявлений", "50 AI запросов", "Сравнение с рынком"]'::jsonb,
  max_proposals = 5,
  duration_days = 30
WHERE tier = 'standard';

UPDATE t_p53065890_farmer_landing_proje.subscription_plans 
SET 
  features = '["Все из Standard", "Безлимит объявлений", "200 AI запросов", "Аналитика", "Поддержка"]'::jsonb,
  max_proposals = NULL,
  duration_days = 30
WHERE tier = 'premium';

-- Добавляем годовой план если его нет
INSERT INTO t_p53065890_farmer_landing_proje.subscription_plans (tier, daily_limit, price_rub, description, features, max_proposals, duration_days)
SELECT 'premium_yearly', 200, 23900, 'Годовая подписка Премиум со скидкой 20%', 
       '["Все из Premium", "Скидка 5980₽", "Поддержка 24/7", "Ранний доступ"]'::jsonb, NULL, 365
WHERE NOT EXISTS (SELECT 1 FROM t_p53065890_farmer_landing_proje.subscription_plans WHERE tier = 'premium_yearly');

-- Добавляем поле status в user_subscriptions если его нет
ALTER TABLE t_p53065890_farmer_landing_proje.user_subscriptions
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_payments_yukassa_id ON t_p53065890_farmer_landing_proje.payments(yukassa_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON t_p53065890_farmer_landing_proje.payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_subs_user_status ON t_p53065890_farmer_landing_proje.user_subscriptions(user_id, status);

-- Обновляем usage_limits если таблица пустая
ALTER TABLE t_p53065890_farmer_landing_proje.usage_limits
ADD COLUMN IF NOT EXISTS proposals_created INTEGER DEFAULT 0;

COMMENT ON TABLE t_p53065890_farmer_landing_proje.subscription_plans IS 'Тарифные планы с интеграцией ЮKassa';
COMMENT ON TABLE t_p53065890_farmer_landing_proje.payments IS 'Платежи через ЮKassa (статусы: pending, succeeded, canceled)';
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.payments.yukassa_payment_id IS 'ID платежа в системе ЮКасса для отслеживания';