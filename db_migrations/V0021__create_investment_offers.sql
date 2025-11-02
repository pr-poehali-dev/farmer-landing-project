-- V0021: Создание таблицы предложений фермеров (investment_offers)
-- Эта таблица содержит предложения фермеров для инвесторов с системой долей

CREATE TABLE investment_offers (
  id                      BIGSERIAL PRIMARY KEY,
  farmer_id               BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farm_name               TEXT NOT NULL,
  title                   TEXT NOT NULL,
  description             TEXT,
  asset                   JSONB, -- произвольный объект актива (например, {"type":"cow","tag":"#5"})
  total_amount            NUMERIC(14,2) NOT NULL CHECK (total_amount > 0),
  share_price             NUMERIC(14,2) NOT NULL CHECK (share_price > 0),
  total_shares            INT NOT NULL CHECK (total_shares > 0),
  available_shares        INT NOT NULL CHECK (available_shares >= 0),
  min_shares              INT NOT NULL DEFAULT 1 CHECK (min_shares > 0),
  expected_monthly_income NUMERIC(14,2),
  region                  VARCHAR(255),
  city                    VARCHAR(255),
  socials                 JSONB, -- {"vk":"...","tg":"...","site":"..."}
  status                  VARCHAR(32) NOT NULL DEFAULT 'draft', -- draft|published|closed
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_offers_farmer ON investment_offers(farmer_id);
CREATE INDEX idx_offers_status ON investment_offers(status);
CREATE INDEX idx_offers_region ON investment_offers(region);
CREATE INDEX idx_offers_created_at ON investment_offers(created_at DESC);

-- Комментарии к таблице
COMMENT ON TABLE investment_offers IS 'Предложения фермеров для инвесторов с системой долей';
COMMENT ON COLUMN investment_offers.total_amount IS 'Общая сумма предложения в рублях';
COMMENT ON COLUMN investment_offers.share_price IS 'Цена одной доли в рублях';
COMMENT ON COLUMN investment_offers.total_shares IS 'Общее количество долей (total_amount / share_price)';
COMMENT ON COLUMN investment_offers.available_shares IS 'Доступное количество долей (уменьшается при одобрении заявок)';
COMMENT ON COLUMN investment_offers.min_shares IS 'Минимальное количество долей для инвестиции';
COMMENT ON COLUMN investment_offers.expected_monthly_income IS 'Ожидаемый месячный доход в рублях';
COMMENT ON COLUMN investment_offers.status IS 'Статус: draft (черновик), published (опубликовано), closed (закрыто)';
