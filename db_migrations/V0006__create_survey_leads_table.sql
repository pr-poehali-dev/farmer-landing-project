CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    user_type VARCHAR(50),
    company_name VARCHAR(255),
    interest_type VARCHAR(255),
    message TEXT,
    rating INTEGER,
    suggestions TEXT,
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);