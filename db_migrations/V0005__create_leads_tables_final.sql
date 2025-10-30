-- Таблица для фермеров
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.farmer_leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для инвесторов
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.investor_leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    interest_type VARCHAR(100),
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для продавцов
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.seller_leads (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_farmer_leads_created_at ON t_p53065890_farmer_landing_proje.farmer_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investor_leads_created_at ON t_p53065890_farmer_landing_proje.investor_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seller_leads_created_at ON t_p53065890_farmer_landing_proje.seller_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_farmer_leads_region ON t_p53065890_farmer_landing_proje.farmer_leads(region);
CREATE INDEX IF NOT EXISTS idx_investor_leads_region ON t_p53065890_farmer_landing_proje.investor_leads(region);
CREATE INDEX IF NOT EXISTS idx_seller_leads_region ON t_p53065890_farmer_landing_proje.seller_leads(region);