-- Таблица для гаража фермеров (техника, оборудование, удобрения)
CREATE TABLE IF NOT EXISTS garage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    items JSONB DEFAULT '[]'::jsonb,
    tech_score INTEGER DEFAULT 0,
    allow_access BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_garage_user_id ON garage(user_id);
CREATE INDEX IF NOT EXISTS idx_garage_tech_score ON garage(tech_score DESC);

-- Добавление полей подписки для продавцов
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_price INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;

-- Таблица для leaderboard (топ хозяйств по баллам)
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    tech_score INTEGER DEFAULT 0,
    farm_name TEXT,
    region TEXT,
    badges JSONB DEFAULT '[]'::jsonb,
    rank INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(tech_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard(user_id);