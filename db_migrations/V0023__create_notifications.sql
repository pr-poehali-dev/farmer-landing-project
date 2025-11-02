-- V0023: Создание таблицы уведомлений (notifications)
-- Эта таблица содержит уведомления для пользователей и админов

CREATE TABLE notifications (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT REFERENCES users(id) ON DELETE CASCADE,
  role       VARCHAR(32), -- admin|farmer|investor (для глобальных уведомлений по ролям)
  type       VARCHAR(64) NOT NULL, -- investment_request_created, request_approved, etc.
  payload    JSONB NOT NULL, -- произвольные данные уведомления
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_role ON notifications(role);
CREATE INDEX idx_notif_type ON notifications(type);
CREATE INDEX idx_notif_is_read ON notifications(is_read);
CREATE INDEX idx_notif_created_at ON notifications(created_at DESC);

-- Составной индекс для быстрого поиска непрочитанных уведомлений пользователя
CREATE INDEX idx_notif_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Комментарии к таблице
COMMENT ON TABLE notifications IS 'Уведомления для пользователей и администраторов';
COMMENT ON COLUMN notifications.user_id IS 'ID пользователя (NULL для глобальных уведомлений по роли)';
COMMENT ON COLUMN notifications.role IS 'Роль для глобальных уведомлений: admin, farmer, investor';
COMMENT ON COLUMN notifications.type IS 'Тип уведомления: request_created, request_approved, request_rejected, etc.';
COMMENT ON COLUMN notifications.payload IS 'JSON с данными уведомления (request_id, offer_id, etc.)';
COMMENT ON COLUMN notifications.is_read IS 'Флаг прочитанного уведомления';
