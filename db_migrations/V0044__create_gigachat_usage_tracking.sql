-- Таблиця для відстеження використання GigaChat по користувачах
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.gigachat_usage (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    request_count INTEGER NOT NULL DEFAULT 0,
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, request_date)
);

-- Таблиця тарифів підписок
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.subscription_plans (
    id SERIAL PRIMARY KEY,
    tier TEXT NOT NULL UNIQUE,
    daily_limit INTEGER NOT NULL,
    price_rub INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляємо тарифні плани
INSERT INTO t_p53065890_farmer_landing_proje.subscription_plans (tier, daily_limit, price_rub, description) VALUES
('free', 3, 0, 'Бесплатная подписка - 3 запроса в день'),
('basic', 30, 1000, 'Базовая подписка - 30 запросов в день за 1000₽/мес'),
('premium', 100, 1500, 'Премиум подписка - 100 запросов в день за 1500₽/мес')
ON CONFLICT (tier) DO NOTHING;

-- Таблиця підписок користувачів
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    tier TEXT NOT NULL DEFAULT 'free',
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_gigachat_usage_user_date ON t_p53065890_farmer_landing_proje.gigachat_usage(user_id, request_date);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON t_p53065890_farmer_landing_proje.user_subscriptions(user_id);