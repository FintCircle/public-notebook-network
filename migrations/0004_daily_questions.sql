CREATE TABLE IF NOT EXISTS daily_questions (
  id TEXT PRIMARY KEY,
  question_number INTEGER NOT NULL,
  prompt TEXT NOT NULL CHECK (length(trim(prompt)) BETWEEN 1 AND 500),
  active_date TEXT NOT NULL,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS daily_questions_active_date_idx
  ON daily_questions (active_date DESC, question_number DESC);

INSERT OR IGNORE INTO daily_questions (id, question_number, prompt, active_date, expires_at)
VALUES (
  'q-2026-10-13',
  1,
  'What would you make more room for in your life?',
  '2026-10-13',
  NULL
);

UPDATE daily_questions
SET expires_at = '2026-10-12'
WHERE id = 'q-2026-09-28';
