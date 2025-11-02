-- Добавляем поле shares в таблицу investments
ALTER TABLE t_p53065890_farmer_landing_proje.investments 
ADD COLUMN IF NOT EXISTS shares integer DEFAULT 1;