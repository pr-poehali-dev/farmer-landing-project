ALTER TABLE t_p53065890_farmer_landing_proje.seller_data 
ADD COLUMN IF NOT EXISTS product_requests jsonb DEFAULT '[]'::jsonb;