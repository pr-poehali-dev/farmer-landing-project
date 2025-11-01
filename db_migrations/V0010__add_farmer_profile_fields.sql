-- Добавляем поля для расширенного профиля фермера
ALTER TABLE farmer_data 
ADD COLUMN farm_name VARCHAR(255),
ADD COLUMN region VARCHAR(255),
ADD COLUMN vk_link VARCHAR(500);

-- Добавляем индекс для быстрого поиска по региону
CREATE INDEX idx_farmer_data_region ON farmer_data(region);