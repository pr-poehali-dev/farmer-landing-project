ALTER TABLE t_p53065890_farmer_landing_proje.users 
ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS oauth_access_token TEXT,
ADD COLUMN IF NOT EXISTS oauth_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE INDEX IF NOT EXISTS idx_users_oauth ON t_p53065890_farmer_landing_proje.users(oauth_provider, oauth_id);