-- Обновление баллов фермера по новой системе расчета
UPDATE t_p53065890_farmer_landing_proje.farmer_scores 
SET total_score = 15, 
    last_updated = NOW()
WHERE user_id = '11';