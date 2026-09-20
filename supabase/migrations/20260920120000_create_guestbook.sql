create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  notepage_slug text not null,
  author_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(trim(message)) between 1 and 500),
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists guestbook_entries_notepage_created_at_idx
  on public.guestbook_entries (notepage_slug, created_at desc);

alter table public.guestbook_entries enable row level security;

create policy "Authenticated readers can view guestbook entries"
  on public.guestbook_entries
  for select
  to authenticated
  using (true);

create policy "Readers can add their own guestbook entries"
  on public.guestbook_entries
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Readers can delete their own guestbook entries"
  on public.guestbook_entries
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);

grant select, insert, delete on public.guestbook_entries to authenticated;
revoke all on public.guestbook_entries from anon;

comment on table public.guestbook_entries is 'Signed-in reader messages left for a Notepage owner.';
comment on column public.guestbook_entries.notepage_slug is 'Public Notepage identifier.';
comment on column public.guestbook_entries.country_code is 'Optional ISO 3166-1 alpha-2 country code for the reader silhouette.';

-- Verification query:
-- select count(*) from public.guestbook_entries;
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = 'guestbook_entries';

-- Apply this migration through the connected Supabase project before wiring the UI.
-- The Supabase CLI is not installed in this workspace, so live execution could not be performed here.
