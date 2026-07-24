-- Account features: subscription tier on users + saved programs shortlist.
-- Idempotent-ish: ALTER will error if the column already exists; run once.

ALTER TABLE users ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'free';

CREATE TABLE IF NOT EXISTS saved_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  program_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_email, program_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_programs(user_email);
