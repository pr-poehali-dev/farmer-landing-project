-- Таблица для фермеров
CREATE TABLE IF NOT EXISTS farmer_leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для инвесторов
CREATE TABLE IF NOT EXISTS investor_leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    interest_type VARCHAR(100),
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для продавцов
CREATE TABLE IF NOT EXISTS seller_leads (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_farmer_leads_created_at ON farmer_leads(created_at DESC);
CREATE INDEX idx_investor_leads_created_at ON investor_leads(created_at DESC);
CREATE INDEX idx_seller_leads_created_at ON seller_leads(created_at DESC);
CREATE INDEX idx_farmer_leads_region ON farmer_leads(region);
CREATE INDEX idx_investor_leads_region ON investor_leads(region);
CREATE INDEX idx_seller_leads_region ON seller_leads(region);