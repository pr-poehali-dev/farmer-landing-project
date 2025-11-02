INSERT INTO farmer_scores (user_id, total_score, productivity_score, tech_score, investment_score, expertise_score, community_score, level)
SELECT 
    CAST(fd.user_id AS TEXT) as user_id,
    0 as total_score,
    0 as productivity_score,
    0 as tech_score,
    0 as investment_score,
    0 as expertise_score,
    0 as community_score,
    1 as level
FROM farmer_data fd
WHERE CAST(fd.user_id AS TEXT) NOT IN (SELECT user_id FROM farmer_scores)
ON CONFLICT (user_id) DO NOTHING;
