create table if not exists public.queue_settings (
  id smallint primary key default 1 check (id = 1),
  avg_minutes integer not null default 5 check (avg_minutes between 1 and 60),
  billing_pix_key text not null default '48.968.488/0001-71',
  billing_pix_name text not null default 'Fila Ai',
  billing_bank_link text not null default 'https://api.whatsapp.com/send?phone=5511943678179&text=Quero%20receber%20o%20link%20de%20pagamento%20do%20FILA%20AI',
  billing_contract_link text not null default 'https://api.whatsapp.com/send?phone=5511943678179&text=Quero%20assinar%20o%20contrato%20anual%20do%20FILA%20AI',
  updated_at timestamptz not null default now()
);

alter table public.queue_settings
  add column if not exists billing_pix_key text not null default '48.968.488/0001-71',
  add column if not exists billing_pix_name text not null default 'Fila Ai',
  add column if not exists billing_bank_link text not null default 'https://api.whatsapp.com/send?phone=5511943678179&text=Quero%20receber%20o%20link%20de%20pagamento%20do%20FILA%20AI',
  add column if not exists billing_contract_link text not null default 'https://api.whatsapp.com/send?phone=5511943678179&text=Quero%20assinar%20o%20contrato%20anual%20do%20FILA%20AI';

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
  queue_open boolean not null default true,
  open_time text not null default '16:00',
  close_time text not null default '19:00',
  logo_url text not null default 'assets/fila-ai-logo-white.png',
  cover_url text not null default 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80',
  dwell_2 integer not null default 50 check (dwell_2 between 15 and 240),
  dwell_4 integer not null default 70 check (dwell_4 between 15 and 240),
  dwell_6 integer not null default 90 check (dwell_6 between 15 and 240),
  theme_mode text not null default 'light' check (theme_mode in ('light', 'dark')),
  accent_color text not null default '#0d6efd' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  owner_status text not null default 'teste',
  payment_status text not null default 'pendente',
  contact_name text not null default '',
  contact_phone text not null default '',
  monthly_price text not null default '',
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  menu_enabled boolean not null default false,
  menu_title text not null default 'Cardápio do restaurante',
  menu_pdf_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trial_requests (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null,
  owner_name text not null,
  phone text not null,
  city text not null default '',
  status text not null default 'novo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trial_tokens (
  token text primary key,
  restaurant_name text not null default '',
  owner_name text not null default '',
  phone text not null default '',
  trial_days integer not null default 7 check (trial_days between 1 and 30),
  status text not null default 'novo',
  used_at timestamptz,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  activated_slug text,
  admin_pin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_requests (
  id uuid primary key default gen_random_uuid(),
  company_slug text not null,
  company_name text not null,
  contact_phone text not null default '',
  plan text not null default 'mensal',
  status text not null default 'novo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fila-ai-assets',
  'fila-ai-assets',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.queue_tickets (
  id uuid primary key default gen_random_uuid(),
  number integer not null,
  name text not null check (char_length(trim(name)) >= 2),
  service text not null,
  status text not null default 'waiting' check (status in ('waiting', 'called', 'done')),
  check_requested boolean not null default false,
  created_at timestamptz not null default now(),
  called_at timestamptz
);

alter table public.queue_tickets
  add column if not exists company_slug text not null default 'restaurante-demo',
  add column if not exists party_size integer not null default 2 check (party_size between 1 and 20),
  add column if not exists check_requested boolean not null default false;

alter table public.queue_companies
  add column if not exists used_2 integer not null default 0 check (used_2 between 0 and 99),
  add column if not exists used_4 integer not null default 0 check (used_4 between 0 and 99),
  add column if not exists used_6 integer not null default 0 check (used_6 between 0 and 99),
  add column if not exists queue_open boolean not null default true,
  add column if not exists open_time text not null default '16:00',
  add column if not exists close_time text not null default '19:00',
  add column if not exists logo_url text not null default 'assets/fila-ai-logo-white.png',
  add column if not exists cover_url text not null default 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80',
  add column if not exists owner_status text not null default 'teste',
  add column if not exists payment_status text not null default 'pendente',
  add column if not exists contact_name text not null default '',
  add column if not exists contact_phone text not null default '',
  add column if not exists monthly_price text not null default '',
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists menu_enabled boolean not null default false,
  add column if not exists menu_title text not null default 'Cardápio do restaurante',
  add column if not exists menu_pdf_url text not null default '',
  add column if not exists created_at timestamptz not null default now();

create index if not exists queue_tickets_status_created_idx
  on public.queue_tickets (status, created_at);

create index if not exists queue_tickets_company_status_created_idx
  on public.queue_tickets (company_slug, status, created_at);

create index if not exists queue_tickets_check_requested_idx
  on public.queue_tickets (company_slug, check_requested, status);

insert into public.queue_settings (id, avg_minutes)
values (1, 5)
on conflict (id) do update
set
  billing_pix_key = coalesce(nullif(public.queue_settings.billing_pix_key, ''), excluded.billing_pix_key),
  billing_pix_name = coalesce(nullif(public.queue_settings.billing_pix_name, ''), excluded.billing_pix_name),
  billing_bank_link = coalesce(nullif(public.queue_settings.billing_bank_link, ''), excluded.billing_bank_link),
  billing_contract_link = coalesce(nullif(public.queue_settings.billing_contract_link, ''), excluded.billing_contract_link);

insert into public.queue_companies (slug, name, admin_pin, tables_2, tables_4, tables_6, dwell_2, dwell_4, dwell_6)
values ('restaurante-demo', 'Restaurante Demo', '1234', 4, 4, 1, 50, 70, 90)
on conflict (slug) do nothing;

grant usage on schema public to anon;
grant select, insert, update on public.queue_companies to anon;
grant select, update on public.queue_settings to anon;
grant select, insert, update, delete on public.queue_tickets to anon;
grant select, insert, update on public.trial_requests to anon;
grant select, insert, update on public.trial_tokens to anon;
grant select, insert, update on public.subscription_requests to anon;

alter table public.queue_companies enable row level security;
alter table public.queue_settings enable row level security;
alter table public.queue_tickets enable row level security;
alter table public.trial_requests enable row level security;
alter table public.trial_tokens enable row level security;
alter table public.subscription_requests enable row level security;

drop policy if exists "Public can read queue companies" on public.queue_companies;
drop policy if exists "Public can create queue companies" on public.queue_companies;
drop policy if exists "Public can update queue companies" on public.queue_companies;
drop policy if exists "Public can read queue settings" on public.queue_settings;
drop policy if exists "Public can update queue settings" on public.queue_settings;
drop policy if exists "Public can read queue tickets" on public.queue_tickets;
drop policy if exists "Public can create queue tickets" on public.queue_tickets;
drop policy if exists "Public can update queue tickets" on public.queue_tickets;
drop policy if exists "Public can delete queue tickets" on public.queue_tickets;
drop policy if exists "Public can read trial requests" on public.trial_requests;
drop policy if exists "Public can create trial requests" on public.trial_requests;
drop policy if exists "Public can update trial requests" on public.trial_requests;
drop policy if exists "Public can read trial tokens" on public.trial_tokens;
drop policy if exists "Public can create trial tokens" on public.trial_tokens;
drop policy if exists "Public can update trial tokens" on public.trial_tokens;
drop policy if exists "Public can read subscription requests" on public.subscription_requests;
drop policy if exists "Public can create subscription requests" on public.subscription_requests;
drop policy if exists "Public can update subscription requests" on public.subscription_requests;
drop policy if exists "Public can read fila ai assets" on storage.objects;
drop policy if exists "Public can upload fila ai assets" on storage.objects;
drop policy if exists "Public can update fila ai assets" on storage.objects;

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

create policy "Public can read trial requests"
  on public.trial_requests for select
  to anon
  using (true);

create policy "Public can create trial requests"
  on public.trial_requests for insert
  to anon
  with check (true);

create policy "Public can update trial requests"
  on public.trial_requests for update
  to anon
  using (true)
  with check (true);

create policy "Public can read trial tokens"
  on public.trial_tokens for select
  to anon
  using (true);

create policy "Public can create trial tokens"
  on public.trial_tokens for insert
  to anon
  with check (true);

create policy "Public can update trial tokens"
  on public.trial_tokens for update
  to anon
  using (true)
  with check (true);

create policy "Public can read subscription requests"
  on public.subscription_requests for select
  to anon
  using (true);

create policy "Public can create subscription requests"
  on public.subscription_requests for insert
  to anon
  with check (true);

create policy "Public can update subscription requests"
  on public.subscription_requests for update
  to anon
  using (true)
  with check (true);

create policy "Public can read fila ai assets"
  on storage.objects for select
  to anon
  using (bucket_id = 'fila-ai-assets');

create policy "Public can upload fila ai assets"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'fila-ai-assets');

create policy "Public can update fila ai assets"
  on storage.objects for update
  to anon
  using (bucket_id = 'fila-ai-assets')
  with check (bucket_id = 'fila-ai-assets');

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

create or replace function public.fila_admin_reset_queue(p_company_slug text, p_admin_pin text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;

  delete from public.queue_tickets
  where company_slug = p_company_slug;

  update public.queue_companies
  set used_2 = 0,
      used_4 = 0,
      used_6 = 0,
      updated_at = now()
  where slug = p_company_slug;
end;
$function$;

create or replace function public.fila_normalize_ticket_company_slug()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  if new.company_slug = 'adriana-turri' then
    new.company_slug := 'restaurante-demo';
  end if;

  if not exists (select 1 from public.queue_companies where slug = new.company_slug) then
    raise exception 'company_not_found';
  end if;

  return new;
end;
$function$;

drop trigger if exists fila_normalize_ticket_company_slug_trigger on public.queue_tickets;
create trigger fila_normalize_ticket_company_slug_trigger
before insert or update of company_slug on public.queue_tickets
for each row execute function public.fila_normalize_ticket_company_slug();
