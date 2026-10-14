ALTER TABLE notepages ADD COLUMN subdomain TEXT;

UPDATE notepages
SET subdomain = lower(slug)
WHERE subdomain IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS notepages_subdomain_unique_idx
  ON notepages (subdomain)
  WHERE subdomain IS NOT NULL;
