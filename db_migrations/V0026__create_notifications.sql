CREATE TABLE notifications (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT,
  role       VARCHAR(32),
  type       VARCHAR(64) NOT NULL,
  payload    JSONB NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notifications ADD CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_role ON notifications(role);
CREATE INDEX idx_notif_type ON notifications(type);
CREATE INDEX idx_notif_is_read ON notifications(is_read);
CREATE INDEX idx_notif_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notif_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;