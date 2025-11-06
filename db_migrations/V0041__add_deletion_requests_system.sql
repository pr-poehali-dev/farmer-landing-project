-- Таблица запросов на удаление предложений
CREATE TABLE IF NOT EXISTS deletion_requests (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL,
    farmer_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_investors INTEGER NOT NULL DEFAULT 0,
    confirmed_investors INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_deletion_requests_proposal ON deletion_requests(proposal_id);
CREATE INDEX idx_deletion_requests_status ON deletion_requests(status);

-- Таблица подтверждений от инвесторов
CREATE TABLE IF NOT EXISTS deletion_confirmations (
    id SERIAL PRIMARY KEY,
    deletion_request_id INTEGER NOT NULL,
    investor_id INTEGER NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(deletion_request_id, investor_id)
);

CREATE INDEX idx_deletion_confirmations_request ON deletion_confirmations(deletion_request_id);
CREATE INDEX idx_deletion_confirmations_investor ON deletion_confirmations(investor_id);

COMMENT ON TABLE deletion_requests IS 'Запросы фермеров на удаление предложений с подтверждением от инвесторов';
COMMENT ON TABLE deletion_confirmations IS 'Подтверждения от инвесторов на удаление предложений';