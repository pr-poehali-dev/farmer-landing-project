-- Добавление данных фермера (user_id = 1)
INSERT INTO t_p53065890_farmer_landing_proje.farmer_data (user_id, cows_count, cows_type, fields_hectares, crops, other_assets, created_at)
VALUES (
  1, 
  15, 
  'Молочные (Голштинская)', 
  25, 
  '{"пшеница": 10, "подсолнечник": 8, "овес": 7}'::jsonb,
  'Пасека (20 ульев), теплица (200 м²), трактор МТЗ-82',
  CURRENT_TIMESTAMP
);

-- Добавление предложений от фермера с правильной структурой
INSERT INTO t_p53065890_farmer_landing_proje.proposals (user_id, photo_url, description, price, shares, type, status, created_at)
VALUES 
(1, NULL, 'Расширение пчелиной пасеки. Планируем увеличить количество ульев с 20 до 50. Инвесторы получат натуральный мед ежегодно (5 кг на каждые 50 000 руб вложений).', 50000.00, 3, 'products', 'active', CURRENT_TIMESTAMP),
(1, NULL, 'Усынови корову Марта. Корова дает 25 литров молока в день. Станьте патроном Марты и получайте свежие молочные продукты + видео-отчеты.', 80000.00, 1, 'patronage', 'active', CURRENT_TIMESTAMP),
(1, NULL, 'Доля в урожае пшеницы. Получите 10% от урожая при инвестировании в строительство нового амбара для хранения зерна.', 200000.00, 5, 'income', 'active', CURRENT_TIMESTAMP);

-- Добавление инвестиций от инвестора (user_id = 2)
INSERT INTO t_p53065890_farmer_landing_proje.investments (user_id, proposal_id, amount, date)
SELECT 2, p.id, 50000.00, CURRENT_TIMESTAMP
FROM t_p53065890_farmer_landing_proje.proposals p
WHERE p.description LIKE 'Расширение пчелиной пасеки%';

INSERT INTO t_p53065890_farmer_landing_proje.investments (user_id, proposal_id, amount, date)
SELECT 2, p.id, 80000.00, CURRENT_TIMESTAMP
FROM t_p53065890_farmer_landing_proje.proposals p
WHERE p.description LIKE 'Усынови корову Марта%';

-- Добавление товаров продавца (user_id = 3)
INSERT INTO t_p53065890_farmer_landing_proje.products (user_id, type, description, price, created_at)
VALUES 
(3, 'Удобрения', 'Органическое удобрение Чернозем+. Натуральное удобрение на основе компоста и биогумуса. Мешок 50 кг.', 2500.00, CURRENT_TIMESTAMP),
(3, 'Оборудование', 'Система капельного полива АгроПро. Автоматическая система. Комплект на 100 м².', 45000.00, CURRENT_TIMESTAMP),
(3, 'Семена', 'Семена томатов Бычье сердце. Элитные семена крупноплодных томатов. Упаковка 100 грамм.', 850.00, CURRENT_TIMESTAMP),
(3, 'Техника', 'Мини-трактор МТЗ-132Н. Компактный трактор для малых хозяйств. Мощность 13 л.с.', 320000.00, CURRENT_TIMESTAMP);

-- Добавление рекламы продавца
INSERT INTO t_p53065890_farmer_landing_proje.ads (user_id, text, image_url, status, created_at)
VALUES 
(3, 'Скидка 20% на удобрения! При покупке от 10 мешков - скидка 20%. Доставка бесплатно.', NULL, 'active', CURRENT_TIMESTAMP),
(3, 'Новинка! Капельный полив со скидкой 15%. Система АгроПро. Установка в подарок!', NULL, 'active', CURRENT_TIMESTAMP);