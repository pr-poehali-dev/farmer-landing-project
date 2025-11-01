-- SQL скрипт для удаления пользователей iliakrasnopeev@yandex.ru
-- Выполните эти команды последовательно в вашей базе данных

-- ШАГ 1: Удаляем все связанные данные пользователя с ID 5
DELETE FROM t_p53065890_farmer_landing_proje.investments WHERE user_id = 5;
DELETE FROM t_p53065890_farmer_landing_proje.proposals WHERE user_id = 5;
DELETE FROM t_p53065890_farmer_landing_proje.products WHERE user_id = 5;
DELETE FROM t_p53065890_farmer_landing_proje.ads WHERE user_id = 5;
DELETE FROM t_p53065890_farmer_landing_proje.farmer_data WHERE user_id = 5;
DELETE FROM t_p53065890_farmer_landing_proje.garage WHERE user_id = 5;
DELETE FROM t_p53065890_farmer_landing_proje.leaderboard WHERE user_id = 5;

-- ШАГ 2: Удаляем самого пользователя с ID 5
DELETE FROM t_p53065890_farmer_landing_proje.users WHERE id = 5;

-- ШАГ 3: Удаляем все связанные данные пользователя с ID 6
DELETE FROM t_p53065890_farmer_landing_proje.investments WHERE user_id = 6;
DELETE FROM t_p53065890_farmer_landing_proje.proposals WHERE user_id = 6;
DELETE FROM t_p53065890_farmer_landing_proje.products WHERE user_id = 6;
DELETE FROM t_p53065890_farmer_landing_proje.ads WHERE user_id = 6;
DELETE FROM t_p53065890_farmer_landing_proje.farmer_data WHERE user_id = 6;
DELETE FROM t_p53065890_farmer_landing_proje.garage WHERE user_id = 6;
DELETE FROM t_p53065890_farmer_landing_proje.leaderboard WHERE user_id = 6;

-- ШАГ 4: Удаляем самого пользователя с ID 6
DELETE FROM t_p53065890_farmer_landing_proje.users WHERE id = 6;

-- Проверка: убедитесь, что пользователи удалены
SELECT id, email, role FROM t_p53065890_farmer_landing_proje.users WHERE id IN (5, 6);
-- Должен вернуть 0 строк
