-- Добавляем новые поля для расширенной системы рейтинга

-- Таблица для хранения детализированной информации о животных
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.farm_animals (
    id SERIAL PRIMARY KEY,
    farmer_data_id INTEGER NOT NULL REFERENCES t_p53065890_farmer_landing_proje.farmer_data(id),
    category VARCHAR(50) NOT NULL,
    direction VARCHAR(50),
    breed VARCHAR(100),
    dairy_head_count INTEGER,
    avg_milk_yield_per_head INTEGER,
    meat_head_count INTEGER,
    avg_meat_yield_per_head NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для хранения информации о культурах
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.farm_crops (
    id SERIAL PRIMARY KEY,
    farmer_data_id INTEGER NOT NULL REFERENCES t_p53065890_farmer_landing_proje.farmer_data(id),
    crop_name VARCHAR(100) NOT NULL,
    sowing_area NUMERIC(10,2) NOT NULL,
    gross_harvest NUMERIC(10,2) NOT NULL,
    yield_per_hectare NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для агротехнологий
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.farm_agro_tech (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER NOT NULL REFERENCES t_p53065890_farmer_landing_proje.farm_crops(id),
    type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    application_rate NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для техники
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.farm_equipment (
    id SERIAL PRIMARY KEY,
    farmer_data_id INTEGER NOT NULL REFERENCES t_p53065890_farmer_landing_proje.farmer_data(id),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем новые поля в farmer_data
ALTER TABLE t_p53065890_farmer_landing_proje.farmer_data 
ADD COLUMN IF NOT EXISTS land_owned NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS land_rented NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS employees_permanent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS employees_seasonal INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_yield INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_technology INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_social INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_investment INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_professionalism INTEGER DEFAULT 0;

-- Таблица для хранения средних показателей по регионам
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.regional_averages (
    id SERIAL PRIMARY KEY,
    region VARCHAR(255) NOT NULL,
    crop_name VARCHAR(100),
    avg_yield NUMERIC(10,2),
    avg_milk_yield INTEGER,
    avg_meat_yield NUMERIC(10,2),
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(region, crop_name, year)
);

-- Индексы для ускорения запросов
CREATE INDEX IF NOT EXISTS idx_farm_animals_farmer ON t_p53065890_farmer_landing_proje.farm_animals(farmer_data_id);
CREATE INDEX IF NOT EXISTS idx_farm_crops_farmer ON t_p53065890_farmer_landing_proje.farm_crops(farmer_data_id);
CREATE INDEX IF NOT EXISTS idx_farm_equipment_farmer ON t_p53065890_farmer_landing_proje.farm_equipment(farmer_data_id);
CREATE INDEX IF NOT EXISTS idx_farm_agro_tech_crop ON t_p53065890_farmer_landing_proje.farm_agro_tech(crop_id);
CREATE INDEX IF NOT EXISTS idx_farmer_data_rating ON t_p53065890_farmer_landing_proje.farmer_data(rating_total DESC);
CREATE INDEX IF NOT EXISTS idx_regional_averages_lookup ON t_p53065890_farmer_landing_proje.regional_averages(region, crop_name, year);

-- Заполняем справочник средними значениями
INSERT INTO t_p53065890_farmer_landing_proje.regional_averages (region, crop_name, avg_yield, avg_milk_yield, avg_meat_yield) VALUES
('Россия', 'Пшеница', 3.2, NULL, NULL),
('Россия', 'Ячмень', 2.8, NULL, NULL),
('Россия', 'Кукуруза', 5.5, NULL, NULL),
('Россия', 'Подсолнечник', 1.8, NULL, NULL),
('Россия', 'Соя', 1.6, NULL, NULL),
('Россия', 'Картофель', 20.0, NULL, NULL),
('Россия', 'Овес', 2.5, NULL, NULL),
('Россия', 'Рожь', 2.3, NULL, NULL),
('Россия', NULL, NULL, 5500, NULL),
('Россия', NULL, NULL, NULL, 250)
ON CONFLICT (region, crop_name, year) DO NOTHING;