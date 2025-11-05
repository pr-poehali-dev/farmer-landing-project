-- Добавляем таблицу для запросов на удаление предложений
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.proposal_deletion_requests (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL,
    farmer_id INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем таблицу для подтверждений инвесторов
CREATE TABLE IF NOT EXISTS t_p53065890_farmer_landing_proje.deletion_confirmations (
    id SERIAL PRIMARY KEY,
    deletion_request_id INTEGER NOT NULL,
    investor_id INTEGER NOT NULL,
    investment_id INTEGER NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    response_text TEXT,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем уникальность для предотвращения дублей
ALTER TABLE t_p53065890_farmer_landing_proje.deletion_confirmations 
    ADD CONSTRAINT unique_deletion_confirmation UNIQUE(deletion_request_id, investor_id);

-- Добавляем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_proposal_deletion_requests_proposal_id 
    ON t_p53065890_farmer_landing_proje.proposal_deletion_requests(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_deletion_requests_status 
    ON t_p53065890_farmer_landing_proje.proposal_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_confirmations_request_id 
    ON t_p53065890_farmer_landing_proje.deletion_confirmations(deletion_request_id);
CREATE INDEX IF NOT EXISTS idx_deletion_confirmations_investor_id 
    ON t_p53065890_farmer_landing_proje.deletion_confirmations(investor_id);