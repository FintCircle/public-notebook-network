-- Complete relational schema for Cloudflare D1 (SQLite).
-- Sitewide database schema for Inktella public notebook network.
-- IDs and ISO-8601 timestamps are supplied by application code or fallback to SQLite datetime('now').

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  country_code TEXT NOT NULL DEFAULT '',
  portrait_url TEXT,
  interests_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(interests_json)),
  links_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(links_json)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notepages (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_path TEXT,
  bg TEXT NOT NULL DEFAULT 'oklch(0.975 0.012 90)',
  ink TEXT NOT NULL DEFAULT 'oklch(0.21 0.015 60)',
  accent TEXT NOT NULL DEFAULT '#c2410c',
  heading_font TEXT NOT NULL DEFAULT 'Space Grotesk',
  body_font TEXT NOT NULL DEFAULT 'DM Sans',
  hand_font TEXT NOT NULL DEFAULT 'Caveat',
  paid_until TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS notepages_owner_id_idx ON notepages (owner_id);
CREATE INDEX IF NOT EXISTS notepages_slug_idx ON notepages (slug);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  notepage_id TEXT NOT NULL REFERENCES notepages (id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  html TEXT NOT NULL DEFAULT '',
  preview TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS notes_notepage_published_at_idx ON notes (notepage_id, published_at DESC);
CREATE INDEX IF NOT EXISTS notes_public_published_at_idx ON notes (status, published_at DESC);
CREATE INDEX IF NOT EXISTS notes_author_updated_at_idx ON notes (author_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS notetags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS note_notetags (
  note_id TEXT NOT NULL REFERENCES notes (id) ON DELETE CASCADE,
  notetag_id TEXT NOT NULL REFERENCES notetags (id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, notetag_id)
);

CREATE INDEX IF NOT EXISTS note_notetags_notetag_id_idx ON note_notetags (notetag_id, note_id);

CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  note_id TEXT NOT NULL REFERENCES notes (id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, note_id)
);

CREATE INDEX IF NOT EXISTS likes_note_id_created_at_idx ON likes (note_id, created_at DESC);

CREATE TABLE IF NOT EXISTS guestnotes (
  id TEXT PRIMARY KEY,
  notepage_id TEXT NOT NULL REFERENCES notepages (id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL CHECK (length(trim(body)) BETWEEN 1 AND 1000),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS guestnotes_notepage_created_at_idx ON guestnotes (notepage_id, created_at DESC);
