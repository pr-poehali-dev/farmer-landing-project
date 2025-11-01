CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.seller_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p53065890_farmer_landing_proje.users(id),
    company_name VARCHAR(255),
    description TEXT,
    website VARCHAR(255),
    vk_link VARCHAR(255),
    telegram_link VARCHAR(255),
    products JSONB DEFAULT '[]'::jsonb,
    ads JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_seller_data_user_id ON t_p53065890_farmer_landing_proje.seller_data(user_id);