create table if not exists public.queue_settings (
  id smallint primary key default 1 check (id = 1),
  avg_minutes integer not null default 5 check (avg_minutes between 1 and 60),
  updated_at timestamptz not null default now()
);

create table if not exists public.queue_companies (
  slug text primary key,
  name text not null,
  admin_pin text not null default '1234',
  tables_2 integer not null default 4 check (tables_2 between 0 and 99),
  tables_4 integer not null default 4 check (tables_4 between 0 and 99),
  tables_6 integer not null default 1 check (tables_6 between 0 and 99),
  used_2 integer not null default 0 check (used_2 between 0 and 99),
  used_4 integer not null default 0 check (used_4 between 0 and 99),
  used_6 integer not null default 0 check (used_6 between 0 and 99),
  dwell_2 integer not null default 50 check (dwell_2 between 15 and 240),
  dwell_4 integer not null default 70 check (dwell_4 between 15 and 240),
  dwell_6 integer not null default 90 check (dwell_6 between 15 and 240),
  theme_mode text not null default 'light' check (theme_mode in ('light', 'dark')),
  accent_color text not null default '#0d6efd' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  updated_at timestamptz not null default now()
);

create table if not exists public.queue_tickets (
  id uuid primary key default gen_random_uuid(),
  number integer not null,
  name text not null check (char_length(trim(name)) >= 2),
  service text not null,
  status text not null default 'waiting' check (status in ('waiting', 'called', 'done')),
  created_at timestamptz not null default now(),
  called_at timestamptz
);

alter table public.queue_tickets
  add column if not exists company_slug text not null default 'restaurante-demo',
  add column if not exists party_size integer not null default 2 check (party_size between 1 and 20);

alter table public.queue_companies
  add column if not exists used_2 integer not null default 0 check (used_2 between 0 and 99),
  add column if not exists used_4 integer not null default 0 check (used_4 between 0 and 99),
  add column if not exists used_6 integer not null default 0 check (used_6 between 0 and 99);

create index if not exists queue_tickets_status_created_idx
  on public.queue_tickets (status, created_at);

create index if not exists queue_tickets_company_status_created_idx
  on public.queue_tickets (company_slug, status, created_at);

insert into public.queue_settings (id, avg_minutes)
values (1, 5)
on conflict (id) do nothing;

insert into public.queue_companies (slug, name, admin_pin, tables_2, tables_4, tables_6, dwell_2, dwell_4, dwell_6)
values ('restaurante-demo', 'Restaurante Demo', '1234', 4, 4, 1, 50, 70, 90)
on conflict (slug) do nothing;

grant usage on schema public to anon;
grant select, insert, update on public.queue_companies to anon;
grant select, update on public.queue_settings to anon;
grant select, insert, update, delete on public.queue_tickets to anon;

alter table public.queue_companies enable row level security;
alter table public.queue_settings enable row level security;
alter table public.queue_tickets enable row level security;

drop policy if exists "Public can read queue companies" on public.queue_companies;
drop policy if exists "Public can create queue companies" on public.queue_companies;
drop policy if exists "Public can update queue companies" on public.queue_companies;
drop policy if exists "Public can read queue settings" on public.queue_settings;
drop policy if exists "Public can update queue settings" on public.queue_settings;
drop policy if exists "Public can read queue tickets" on public.queue_tickets;
drop policy if exists "Public can create queue tickets" on public.queue_tickets;
drop policy if exists "Public can update queue tickets" on public.queue_tickets;
drop policy if exists "Public can delete queue tickets" on public.queue_tickets;

create policy "Public can read queue companies"
  on public.queue_companies for select
  to anon
  using (true);

create policy "Public can create queue companies"
  on public.queue_companies for insert
  to anon
  with check (true);

create policy "Public can update queue companies"
  on public.queue_companies for update
  to anon
  using (true)
  with check (true);

create policy "Public can read queue settings"
  on public.queue_settings for select
  to anon
  using (true);

create policy "Public can update queue settings"
  on public.queue_settings for update
  to anon
  using (true)
  with check (true);

create policy "Public can read queue tickets"
  on public.queue_tickets for select
  to anon
  using (true);

create policy "Public can create queue tickets"
  on public.queue_tickets for insert
  to anon
  with check (status = 'waiting');

create policy "Public can update queue tickets"
  on public.queue_tickets for update
  to anon
  using (true)
  with check (true);

create policy "Public can delete queue tickets"
  on public.queue_tickets for delete
  to anon
  using (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'queue_settings'
  ) then
    alter publication supabase_realtime add table public.queue_settings;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'queue_companies'
  ) then
    alter publication supabase_realtime add table public.queue_companies;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'queue_tickets'
  ) then
    alter publication supabase_realtime add table public.queue_tickets;
  end if;
end $$;
