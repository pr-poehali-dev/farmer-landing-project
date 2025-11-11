-- Migrate data from farmer_data.assets to farm_diagnostics table

-- Insert or update records in farm_diagnostics from farmer_data.assets
INSERT INTO farm_diagnostics (user_id, land_area, animals, equipment, crops, employees_permanent, employees_seasonal, created_at, updated_at)
SELECT 
    fd.user_id,
    COALESCE((assets->0->>'land_area')::varchar, '0'),
    COALESCE(assets->0->'animals', '[]'::jsonb),
    COALESCE(assets->0->'equipment', '[]'::jsonb),
    COALESCE(assets->0->'crops', '[]'::jsonb),
    COALESCE(fd.employees_permanent, 0),
    COALESCE(fd.employees_seasonal, 0),
    NOW(),
    NOW()
FROM farmer_data fd
WHERE 
    jsonb_array_length(fd.assets) > 0
    AND NOT EXISTS (
        SELECT 1 FROM farm_diagnostics fdiag WHERE fdiag.user_id = fd.user_id
    )
ON CONFLICT (user_id) DO UPDATE SET
    land_area = EXCLUDED.land_area,
    animals = EXCLUDED.animals,
    equipment = EXCLUDED.equipment,
    crops = EXCLUDED.crops,
    employees_permanent = EXCLUDED.employees_permanent,
    employees_seasonal = EXCLUDED.employees_seasonal,
    updated_at = NOW();
