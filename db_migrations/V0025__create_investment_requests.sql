CREATE TABLE investment_requests (
  id                BIGSERIAL PRIMARY KEY,
  offer_id          BIGINT NOT NULL,
  investor_id       BIGINT NOT NULL,
  shares_requested  INT NOT NULL CHECK (shares_requested > 0),
  amount            NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  message           TEXT,
  status            VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE investment_requests ADD CONSTRAINT fk_requests_offer FOREIGN KEY (offer_id) REFERENCES investment_offers(id);
ALTER TABLE investment_requests ADD CONSTRAINT fk_requests_investor FOREIGN KEY (investor_id) REFERENCES users(id);

CREATE INDEX idx_requests_offer ON investment_requests(offer_id);
CREATE INDEX idx_requests_investor ON investment_requests(investor_id);
CREATE INDEX idx_requests_status ON investment_requests(status);
CREATE INDEX idx_requests_created_at ON investment_requests(created_at DESC);
CREATE INDEX idx_requests_offer_status ON investment_requests(offer_id, status);