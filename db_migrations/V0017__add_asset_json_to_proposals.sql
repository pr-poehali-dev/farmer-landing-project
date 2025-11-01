-- Add asset column to store full asset data from diagnosis
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS asset jsonb DEFAULT '{}'::jsonb;

-- Update existing proposals to have empty asset object if null
UPDATE proposals SET asset = '{}'::jsonb WHERE asset IS NULL;

COMMENT ON COLUMN proposals.asset IS 'Full asset data from farmer diagnosis: {name, type, count, details, etc.}';
