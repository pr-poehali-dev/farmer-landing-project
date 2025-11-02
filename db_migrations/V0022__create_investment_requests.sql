-- V0022: Создание таблицы заявок инвесторов (investment_requests)
-- Эта таблица содержит заявки инвесторов на предложения фермеров

CREATE TABLE investment_requests (
  id                BIGSERIAL PRIMARY KEY,
  offer_id          BIGINT NOT NULL REFERENCES investment_offers(id) ON DELETE CASCADE,
  investor_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shares_requested  INT NOT NULL CHECK (shares_requested > 0),
  amount            NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  message           TEXT,
  status            VARCHAR(32) NOT NULL DEFAULT 'pending', -- pending|approved|rejected|canceled
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_requests_offer ON investment_requests(offer_id);
CREATE INDEX idx_requests_investor ON investment_requests(investor_id);
CREATE INDEX idx_requests_status ON investment_requests(status);
CREATE INDEX idx_requests_created_at ON investment_requests(created_at DESC);

-- Составной индекс для быстрого поиска заявок по предложению и статусу
CREATE INDEX idx_requests_offer_status ON investment_requests(offer_id, status);

-- Комментарии к таблице
COMMENT ON TABLE investment_requests IS 'Заявки инвесторов на предложения фермеров';
COMMENT ON COLUMN investment_requests.shares_requested IS 'Количество запрошенных долей';
COMMENT ON COLUMN investment_requests.amount IS 'Сумма инвестиции в рублях (shares_requested * share_price)';
COMMENT ON COLUMN investment_requests.message IS 'Комментарий инвестора к заявке';
COMMENT ON COLUMN investment_requests.status IS 'Статус: pending (ожидает), approved (одобрено), rejected (отклонено), canceled (отменено)';
