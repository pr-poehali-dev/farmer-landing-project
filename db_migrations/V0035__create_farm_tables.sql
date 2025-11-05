-- Таблица для пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    farm_name VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для профилей фермеров
CREATE TABLE IF NOT EXISTS farmer_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    bio TEXT,
    farm_name VARCHAR(255),
    region VARCHAR(255),
    address TEXT,
    vk_link VARCHAR(500),
    telegram_link VARCHAR(500),
    instagram_link VARCHAR(500),
    youtube_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Таблица для диагностики хозяйства
CREATE TABLE IF NOT EXISTS farm_diagnostics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    land_area VARCHAR(50),
    land_owned VARCHAR(50),
    land_rented VARCHAR(50),
    animals JSONB DEFAULT '[]',
    equipment JSONB DEFAULT '[]',
    crops JSONB DEFAULT '[]',
    employees_permanent INTEGER DEFAULT 0,
    employees_seasonal INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Таблица для рейтингов фермеров
CREATE TABLE IF NOT EXISTS farmer_scores (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    productivity_score INTEGER DEFAULT 0,
    tech_score INTEGER DEFAULT 0,
    investment_score INTEGER DEFAULT 0,
    expertise_score INTEGER DEFAULT 0,
    community_score INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_farmer_data_user_id ON farmer_data(user_id);
CREATE INDEX IF NOT EXISTS idx_farm_diagnostics_user_id ON farm_diagnostics(user_id);
CREATE INDEX IF NOT EXISTS idx_farmer_scores_user_id ON farmer_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_farmer_scores_total ON farmer_scores(total_score DESC);
