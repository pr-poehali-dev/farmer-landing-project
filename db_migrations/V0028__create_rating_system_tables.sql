CREATE TABLE IF NOT EXISTS farmer_scores (
    user_id VARCHAR(255) PRIMARY KEY,
    productivity_score INT DEFAULT 0,
    tech_score INT DEFAULT 0,
    investment_score INT DEFAULT 0,
    expertise_score INT DEFAULT 0,
    community_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    level INT DEFAULT 1,
    achievements JSONB DEFAULT '[]',
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    criteria JSONB,
    points INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS leaderboards (
    id SERIAL PRIMARY KEY,
    period VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    score INT DEFAULT 0,
    rank INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_quests (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    quest_type VARCHAR(50) NOT NULL,
    quest_name VARCHAR(200) NOT NULL,
    points INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    quest_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farmer_scores_total ON farmer_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_period_category ON leaderboards(period, category, rank);
CREATE INDEX IF NOT EXISTS idx_daily_quests_user_date ON daily_quests(user_id, quest_date);

INSERT INTO achievements (name, category, icon, description, points) VALUES
('Первый шаг', 'investment', 'Sprout', 'Создано первое предложение для инвесторов', 30),
('Активный фермер', 'investment', 'TrendingUp', 'Создано 5 предложений', 150),
('Профессионал', 'investment', 'Award', 'Создано 10 предложений', 300),
('Привлечение капитала', 'investment', 'DollarSign', 'Получено первое инвестирование', 50),
('Полный профиль', 'expertise', 'UserCheck', 'Заполнены все данные профиля', 20),
('Первая покупка', 'community', 'ShoppingBag', 'Совершена покупка в магазине', 15),
('Золотой Колос', 'productivity', 'Award', 'Топ-3 по урожайности региона', 500),
('Техномагнат', 'tech', 'Wrench', 'Лучший гараж региона', 400),
('Любимец Инвесторов', 'investment', 'Heart', 'Топ-5 по привлечённым инвестициям', 600),
('Сенсей Фермерства', 'expertise', 'GraduationCap', 'Завершено 10 обучающих курсов', 350),
('Столп Общины', 'community', 'Users', 'Топ-10 по социальной активности', 450);
