-- Добавляем новые поля для типов продуктов
ALTER TABLE t_p53065890_farmer_landing_proje.proposals
ADD COLUMN product_type VARCHAR(20) CHECK (product_type IN ('income', 'product', 'patronage')),
ADD COLUMN asset_type VARCHAR(50),
ADD COLUMN asset_details VARCHAR(100),
ADD COLUMN expected_product TEXT,
ADD COLUMN updates JSONB DEFAULT '[]'::jsonb,
ADD COLUMN update_frequency VARCHAR(20);

-- Обновляем существующие записи: устанавливаем product_type = 'income' по умолчанию
UPDATE t_p53065890_farmer_landing_proje.proposals
SET product_type = 'income'
WHERE product_type IS NULL;

-- Комментарии для ясности
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.proposals.product_type IS 'Тип продукта: income (доход), product (физический продукт), patronage (патронаж)';
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.proposals.asset_type IS 'Тип актива: Гектар земли, Доля коровы, Вся ферма';
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.proposals.asset_details IS 'Детали актива: рапс, кукуруза, соя, чеснок, молочное, мясное';
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.proposals.expected_product IS 'Ожидаемый продукт для типа product';
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.proposals.updates IS 'Массив обновлений для патронажа (JSON)';
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.proposals.update_frequency IS 'Частота обновлений: weekly, monthly';