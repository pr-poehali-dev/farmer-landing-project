CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    user_type VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    interest_type VARCHAR(100),
    message TEXT,
    rating INTEGER,
    suggestions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_user_type ON leads(user_type);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);