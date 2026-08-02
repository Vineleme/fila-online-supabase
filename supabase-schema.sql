create table if not exists public.queue_settings (
  id smallint primary key default 1 check (id = 1),
  avg_minutes integer not null default 5 check (avg_minutes between 1 and 60),
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

create index if not exists queue_tickets_status_created_idx
  on public.queue_tickets (status, created_at);

insert into public.queue_settings (id, avg_minutes)
values (1, 5)
on conflict (id) do nothing;

grant usage on schema public to anon;
grant select, update on public.queue_settings to anon;
grant select, insert, update, delete on public.queue_tickets to anon;

alter table public.queue_settings enable row level security;
alter table public.queue_tickets enable row level security;

drop policy if exists "Public can read queue settings" on public.queue_settings;
drop policy if exists "Public can update queue settings" on public.queue_settings;
drop policy if exists "Public can read queue tickets" on public.queue_tickets;
drop policy if exists "Public can create queue tickets" on public.queue_tickets;
drop policy if exists "Public can update queue tickets" on public.queue_tickets;
drop policy if exists "Public can delete queue tickets" on public.queue_tickets;

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

alter publication supabase_realtime add table public.queue_settings;
alter publication supabase_realtime add table public.queue_tickets;
