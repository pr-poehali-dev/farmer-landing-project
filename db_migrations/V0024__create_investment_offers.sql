CREATE TABLE investment_offers (
  id                      BIGSERIAL PRIMARY KEY,
  farmer_id               BIGINT NOT NULL,
  farm_name               TEXT NOT NULL,
  title                   TEXT NOT NULL,
  description             TEXT,
  asset                   JSONB,
  total_amount            NUMERIC(14,2) NOT NULL CHECK (total_amount > 0),
  share_price             NUMERIC(14,2) NOT NULL CHECK (share_price > 0),
  total_shares            INT NOT NULL CHECK (total_shares > 0),
  available_shares        INT NOT NULL CHECK (available_shares >= 0),
  min_shares              INT NOT NULL DEFAULT 1 CHECK (min_shares > 0),
  expected_monthly_income NUMERIC(14,2),
  region                  VARCHAR(255),
  city                    VARCHAR(255),
  socials                 JSONB,
  status                  VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE investment_offers ADD CONSTRAINT fk_offers_farmer FOREIGN KEY (farmer_id) REFERENCES users(id);

CREATE INDEX idx_offers_farmer ON investment_offers(farmer_id);
CREATE INDEX idx_offers_status ON investment_offers(status);
CREATE INDEX idx_offers_region ON investment_offers(region);
CREATE INDEX idx_offers_created_at ON investment_offers(created_at DESC);