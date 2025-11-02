-- Добавление колонки income_details в таблицу proposals для хранения детальной информации о доходности

ALTER TABLE t_p53065890_farmer_landing_proje.proposals 
ADD COLUMN IF NOT EXISTS income_details JSONB DEFAULT NULL;

COMMENT ON COLUMN t_p53065890_farmer_landing_proje.proposals.income_details IS 'Детали доходности: revenue_period, revenue_amount, revenue_description, maintenance_cost, payout_amount, payout_period, payout_duration, last_year_yield';