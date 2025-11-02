-- Добавление поля balance для всех пользователей
ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN balance DECIMAL(10, 2) DEFAULT 0.00;

-- Комментарий для поля
COMMENT ON COLUMN t_p53065890_farmer_landing_proje.users.balance IS 'Баланс пользователя в рублях';