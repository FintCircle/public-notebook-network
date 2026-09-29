create table public.profiles (
  id uuid primary key,
  display_name text not null default '',
  bio text not null default '',
  country text not null default '',
  country_code text not null default '',
  portrait_url text,
  interests text[] not null default '{}',
  links jsonb not null default '[]',
  created_at timestamptz not null default now()
);
grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles own insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles own update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, portrait_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.notepages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text not null default '',
  cover_path text,
  bg text not null default 'oklch(0.975 0.012 90)',
  ink text not null default 'oklch(0.21 0.015 60)',
  accent text not null default '#c2410c',
  heading_font text not null default 'Space Grotesk',
  body_font text not null default 'DM Sans',
  hand_font text not null default 'Caveat',
  paid_until timestamptz,
  created_at timestamptz not null default now()
);
grant select on public.notepages to anon;
grant select, insert, update, delete on public.notepages to authenticated;
grant all on public.notepages to service_role;
alter table public.notepages enable row level security;
create policy "notepages public read" on public.notepages for select using (true);
create policy "notepages own insert" on public.notepages for insert to authenticated with check (auth.uid() = owner_id);
create policy "notepages own update" on public.notepages for update to authenticated using (auth.uid() = owner_id);
create policy "notepages own delete" on public.notepages for delete to authenticated using (auth.uid() = owner_id);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  notepage_id uuid not null references public.notepages(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default '',
  html text not null default '',
  preview text not null default '',
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.notes to anon;
grant select, insert, update, delete on public.notes to authenticated;
grant all on public.notes to service_role;
alter table public.notes enable row level security;
create policy "notes public read published" on public.notes for select using (status = 'published');
create policy "notes owner read" on public.notes for select to authenticated using (auth.uid() = author_id);
create policy "notes owner insert" on public.notes for insert to authenticated with check (
  auth.uid() = author_id and exists (select 1 from public.notepages p where p.id = notepage_id and p.owner_id = auth.uid()));
create policy "notes owner update" on public.notes for update to authenticated using (auth.uid() = author_id);
create policy "notes owner delete" on public.notes for delete to authenticated using (auth.uid() = author_id);

create table public.notetags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);
grant select on public.notetags to anon;
grant select, insert on public.notetags to authenticated;
grant all on public.notetags to service_role;
alter table public.notetags enable row level security;
create policy "notetags public read" on public.notetags for select using (true);
create policy "notetags signed-in create" on public.notetags for insert to authenticated with check (true);

create table public.note_notetags (
  note_id uuid not null references public.notes(id) on delete cascade,
  notetag_id uuid not null references public.notetags(id) on delete cascade,
  primary key (note_id, notetag_id)
);
grant select on public.note_notetags to anon;
grant select, insert, delete on public.note_notetags to authenticated;
grant all on public.note_notetags to service_role;
alter table public.note_notetags enable row level security;
create policy "note_notetags public read" on public.note_notetags for select using (true);
create policy "note_notetags owner write" on public.note_notetags for insert to authenticated with check (
  exists (select 1 from public.notes n where n.id = note_id and n.author_id = auth.uid()));
create policy "note_notetags owner delete" on public.note_notetags for delete to authenticated using (
  exists (select 1 from public.notes n where n.id = note_id and n.author_id = auth.uid()));

create table public.likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  note_id uuid not null references public.notes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, note_id)
);
grant select on public.likes to anon;
grant select, insert, delete on public.likes to authenticated;
grant all on public.likes to service_role;
alter table public.likes enable row level security;
create policy "likes public read" on public.likes for select using (true);
create policy "likes own insert" on public.likes for insert to authenticated with check (auth.uid() = user_id);
create policy "likes own delete" on public.likes for delete to authenticated using (auth.uid() = user_id);

create table public.guestnotes (
  id uuid primary key default gen_random_uuid(),
  notepage_id uuid not null references public.notepages(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
grant select on public.guestnotes to anon;
grant select, insert, delete on public.guestnotes to authenticated;
grant all on public.guestnotes to service_role;
alter table public.guestnotes enable row level security;
create policy "guestnotes public read" on public.guestnotes for select using (true);
create policy "guestnotes own insert" on public.guestnotes for insert to authenticated with check (auth.uid() = author_id);
create policy "guestnotes author or owner delete" on public.guestnotes for delete to authenticated using (
  auth.uid() = author_id or exists (select 1 from public.notepages p where p.id = notepage_id and p.owner_id = auth.uid()));

create policy "covers public read" on storage.objects for select using (bucket_id = 'covers');
create policy "covers own upload" on storage.objects for insert to authenticated with check (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "covers own update" on storage.objects for update to authenticated using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "covers own delete" on storage.objects for delete to authenticated using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);