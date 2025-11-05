-- Добавление полей для OAuth авторизации
ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS oauth_provider_id VARCHAR(255);

-- Индекс для быстрого поиска по OAuth
CREATE INDEX IF NOT EXISTS idx_users_oauth ON t_p53065890_farmer_landing_proje.users(oauth_provider, oauth_provider_id);
