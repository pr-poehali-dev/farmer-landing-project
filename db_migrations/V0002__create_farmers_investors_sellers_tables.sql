-- Создание таблицы фермеров
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    equity_offer TEXT NOT NULL,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы инвесторов
CREATE TABLE IF NOT EXISTS investors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    investment_amount DECIMAL(12, 2) NOT NULL,
    desired_return_type VARCHAR(50) NOT NULL CHECK (desired_return_type IN ('product', 'money', 'animal_observation')),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы продавцов сельхозтоваров
CREATE TABLE IF NOT EXISTS agro_sellers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    payment_for_analytics DECIMAL(12, 2) NOT NULL,
    interested_in_contacts BOOLEAN DEFAULT true,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для быстрого поиска
CREATE INDEX idx_farmers_region ON farmers(region);
CREATE INDEX idx_investors_return_type ON investors(desired_return_type);
CREATE INDEX idx_agro_sellers_payment ON agro_sellers(payment_for_analytics);