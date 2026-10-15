CREATE TABLE IF NOT EXISTS note_comments (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL REFERENCES notes (id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES note_comments (id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(trim(body)) BETWEEN 1 AND 2000),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  reported_at TEXT
);
CREATE INDEX IF NOT EXISTS note_comments_note_created_idx ON note_comments(note_id, created_at ASC);
ALTER TABLE notes ADD COLUMN comments_enabled INTEGER NOT NULL DEFAULT 1;
