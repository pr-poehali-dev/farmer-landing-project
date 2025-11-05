-- Применение миграции для системы рейтинга (повторное выполнение с IF NOT EXISTS)

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