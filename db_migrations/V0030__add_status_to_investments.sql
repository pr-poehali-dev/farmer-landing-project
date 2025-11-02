ALTER TABLE investments 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

UPDATE investments SET status = 'pending' WHERE status IS NULL;

COMMENT ON COLUMN investments.status IS 'Статус инвестиции: pending (ждет подтверждения), active (активна), rejected (отклонена), cancelled (отменена)';