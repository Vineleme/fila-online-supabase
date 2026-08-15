-- FILA AI security hardening.
-- Apply after the base schema. Then create the CEO user in Supabase Auth and
-- insert the authorized email in public.ceo_profiles.

create extension if not exists pgcrypto;
create extension if not exists unaccent;

create table if not exists public.ceo_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ceo_allowed_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.ceo_allowed_emails (email)
values (lower('vineleme@icloud.com'))
on conflict (email) do nothing;

alter table public.ceo_profiles enable row level security;
alter table public.ceo_allowed_emails enable row level security;

drop policy if exists "CEO can read own profile" on public.ceo_profiles;
create policy "CEO can read own profile"
  on public.ceo_profiles for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.fila_claim_allowed_ceo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.ceo_allowed_emails
    where email = lower(new.email)
  ) then
    insert into public.ceo_profiles (user_id, email)
    values (new.id, lower(new.email))
    on conflict (user_id) do update set email = excluded.email;
  end if;

  return new;
end;
$$;

drop trigger if exists fila_claim_allowed_ceo_after_auth_user on auth.users;
create trigger fila_claim_allowed_ceo_after_auth_user
after insert or update of email on auth.users
for each row execute function public.fila_claim_allowed_ceo();

insert into public.ceo_profiles (user_id, email)
select id, lower(email)
from auth.users
where lower(email) in (select email from public.ceo_allowed_emails)
on conflict (user_id) do update set email = excluded.email;

create or replace function public.fila_is_ceo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ceo_profiles
    where user_id = auth.uid()
  );
$$;

drop policy if exists "CEO can read allowed emails" on public.ceo_allowed_emails;
create policy "CEO can read allowed emails"
  on public.ceo_allowed_emails for select
  to authenticated
  using (public.fila_is_ceo());

create or replace function public.fila_admin_authorized(p_company_slug text, p_admin_pin text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.queue_companies
    where slug = p_company_slug
      and admin_pin = p_admin_pin
  );
$$;

create or replace function public.fila_random_pin()
returns text
language sql
volatile
security definer
set search_path = public
as $$
  select lpad((floor(random() * 9000) + 1000)::int::text, 4, '0');
$$;

create or replace function public.fila_slugify(p_value text)
returns text
language sql
stable
as $$
  select trim(both '-' from regexp_replace(lower(unaccent(coalesce(p_value, 'restaurante'))), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.fila_company_slug_exists(p_company_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.queue_companies where slug = p_company_slug);
$$;

create or replace function public.fila_public_company(p_company_slug text)
returns table (
  slug text,
  name text,
  tables_2 integer,
  tables_4 integer,
  tables_6 integer,
  used_2 integer,
  used_4 integer,
  used_6 integer,
  queue_open boolean,
  open_time text,
  close_time text,
  logo_url text,
  cover_url text,
  dwell_2 integer,
  dwell_4 integer,
  dwell_6 integer,
  theme_mode text,
  accent_color text,
  owner_status text,
  payment_status text,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  menu_enabled boolean,
  menu_title text,
  menu_pdf_url text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    qc.slug, qc.name, qc.tables_2, qc.tables_4, qc.tables_6,
    qc.used_2, qc.used_4, qc.used_6, qc.queue_open, qc.open_time,
    qc.close_time, qc.logo_url, qc.cover_url, qc.dwell_2, qc.dwell_4,
    qc.dwell_6, qc.theme_mode, qc.accent_color, qc.owner_status,
    qc.payment_status, qc.trial_started_at, qc.trial_ends_at,
    qc.menu_enabled, qc.menu_title, qc.menu_pdf_url, qc.created_at,
    qc.updated_at
  from public.queue_companies qc
  where qc.slug = p_company_slug;
$$;

create or replace function public.fila_admin_company(p_company_slug text, p_admin_pin text)
returns setof public.queue_companies
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.queue_companies qc
  where qc.slug = p_company_slug
    and qc.admin_pin = p_admin_pin;
$$;

create or replace function public.fila_trial_token_public(p_token text)
returns table (
  token text,
  restaurant_name text,
  phone text,
  trial_days integer,
  status text,
  used_at timestamptz,
  activated_slug text,
  trial_ends_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select tt.token, tt.restaurant_name, tt.phone, tt.trial_days, tt.status,
         tt.used_at, tt.activated_slug, tt.trial_ends_at
  from public.trial_tokens tt
  where tt.token = p_token
    and tt.status <> 'cancelado';
$$;

create or replace function public.fila_activate_trial_token(
  p_token text,
  p_restaurant_name text,
  p_owner_name text,
  p_phone text
)
returns table (
  activated_slug text,
  admin_pin text,
  trial_ends_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token public.trial_tokens%rowtype;
  v_slug text;
  v_candidate text;
  v_suffix integer := 0;
  v_pin text;
  v_started_at timestamptz := now();
  v_ends_at timestamptz;
begin
  select *
  into v_token
  from public.trial_tokens
  where token = p_token
  for update;

  if not found or v_token.status = 'cancelado' then
    raise exception 'invalid_token';
  end if;

  if v_token.used_at is not null and v_token.activated_slug is not null then
    activated_slug := v_token.activated_slug;
    admin_pin := null;
    trial_ends_at := v_token.trial_ends_at;
    return next;
    return;
  end if;

  v_candidate := nullif(public.fila_slugify(p_restaurant_name), '');
  if v_candidate is null then
    v_candidate := 'restaurante';
  end if;
  v_slug := v_candidate;
  while exists (select 1 from public.queue_companies where slug = v_slug) loop
    v_suffix := v_suffix + 1;
    v_slug := v_candidate || '-' || v_suffix;
  end loop;

  v_pin := public.fila_random_pin();
  v_ends_at := v_started_at + (greatest(1, least(coalesce(v_token.trial_days, 7), 30)) || ' days')::interval;

  insert into public.queue_companies (
    slug, name, admin_pin, tables_2, tables_4, tables_6, used_2, used_4, used_6,
    queue_open, open_time, close_time, logo_url, cover_url, dwell_2, dwell_4, dwell_6,
    theme_mode, accent_color, owner_status, payment_status, contact_name, contact_phone,
    monthly_price, trial_started_at, trial_ends_at, menu_enabled, menu_title, menu_pdf_url
  )
  values (
    v_slug, p_restaurant_name, encode(extensions.digest(v_pin, 'sha256'), 'hex'),
    4, 4, 1, 0, 0, 0, true, '16:00', '19:00',
    'assets/fila-ai-logo-white.png',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80',
    50, 70, 90, 'light', '#0d6efd', 'teste', 'pendente',
    p_owner_name, p_phone, '', v_started_at, v_ends_at, false, 'Cardapio do restaurante', ''
  );

  update public.trial_tokens
  set status = 'usado',
      used_at = v_started_at,
      trial_started_at = v_started_at,
      trial_ends_at = v_ends_at,
      activated_slug = v_slug,
      admin_pin = null,
      restaurant_name = p_restaurant_name,
      owner_name = p_owner_name,
      phone = p_phone,
      updated_at = now()
  where token = p_token;

  activated_slug := v_slug;
  admin_pin := v_pin;
  trial_ends_at := v_ends_at;
  return next;
end;
$$;

drop function if exists public.fila_update_company(text, text, text, integer, integer, integer, integer, integer, integer, boolean, text, text, text, text, integer, integer, integer, text, boolean, text, text);

create or replace function public.fila_update_company(
  p_company_slug text,
  p_admin_pin text,
  p_name text,
  p_tables_2 integer,
  p_tables_4 integer,
  p_tables_6 integer,
  p_used_2 integer,
  p_used_4 integer,
  p_used_6 integer,
  p_queue_open boolean,
  p_open_time text,
  p_close_time text,
  p_logo_url text,
  p_cover_url text,
  p_dwell_2 integer,
  p_dwell_4 integer,
  p_dwell_6 integer,
  p_theme_mode text,
  p_legal_name text,
  p_company_document text,
  p_fiscal_address text,
  p_fiscal_city text,
  p_fiscal_state text,
  p_billing_email text,
  p_contact_name text,
  p_contact_phone text,
  p_menu_enabled boolean,
  p_menu_title text,
  p_menu_pdf_url text
)
returns setof public.queue_companies
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;

  return query
  update public.queue_companies
  set name = p_name,
      tables_2 = p_tables_2,
      tables_4 = p_tables_4,
      tables_6 = p_tables_6,
      used_2 = p_used_2,
      used_4 = p_used_4,
      used_6 = p_used_6,
      queue_open = p_queue_open,
      open_time = p_open_time,
      close_time = p_close_time,
      logo_url = p_logo_url,
      cover_url = p_cover_url,
      dwell_2 = p_dwell_2,
      dwell_4 = p_dwell_4,
      dwell_6 = p_dwell_6,
      theme_mode = p_theme_mode,
      legal_name = coalesce(p_legal_name, ''),
      company_document = coalesce(p_company_document, ''),
      fiscal_address = coalesce(p_fiscal_address, ''),
      fiscal_city = coalesce(p_fiscal_city, ''),
      fiscal_state = coalesce(p_fiscal_state, ''),
      billing_email = coalesce(p_billing_email, ''),
      contact_name = coalesce(p_contact_name, ''),
      contact_phone = coalesce(p_contact_phone, ''),
      menu_enabled = p_menu_enabled,
      menu_title = p_menu_title,
      menu_pdf_url = p_menu_pdf_url,
      updated_at = now()
  where slug = p_company_slug
  returning *;
end;
$$;

create or replace function public.fila_update_menu(
  p_company_slug text,
  p_admin_pin text,
  p_menu_enabled boolean,
  p_menu_title text,
  p_menu_pdf_url text
)
returns setof public.queue_companies
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;

  return query
  update public.queue_companies
  set menu_enabled = p_menu_enabled,
      menu_title = p_menu_title,
      menu_pdf_url = p_menu_pdf_url,
      updated_at = now()
  where slug = p_company_slug
  returning *;
end;
$$;

create or replace function public.fila_change_admin_pin(
  p_company_slug text,
  p_current_admin_pin text,
  p_next_admin_pin text
)
returns setof public.queue_companies
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_current_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;

  return query
  update public.queue_companies
  set admin_pin = p_next_admin_pin,
      updated_at = now()
  where slug = p_company_slug
  returning *;
end;
$$;

create or replace function public.fila_ceo_reset_admin_pin(
  p_company_slug text,
  p_next_admin_pin text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_is_ceo() then
    raise exception 'ceo_not_authorized';
  end if;

  update public.queue_companies
  set admin_pin = p_next_admin_pin,
      updated_at = now()
  where slug = p_company_slug;

  if not found then
    raise exception 'company_not_found';
  end if;
end;
$$;

create or replace function public.fila_set_used_tables(
  p_company_slug text,
  p_admin_pin text,
  p_bucket integer,
  p_delta integer
)
returns setof public.queue_companies
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;

  return query
  update public.queue_companies
  set used_2 = case when p_bucket = 2 then greatest(0, least(tables_2, used_2 + p_delta)) else used_2 end,
      used_4 = case when p_bucket = 4 then greatest(0, least(tables_4, used_4 + p_delta)) else used_4 end,
      used_6 = case when p_bucket = 6 then greatest(0, least(tables_6, used_6 + p_delta)) else used_6 end,
      updated_at = now()
  where slug = p_company_slug
  returning *;
end;
$$;

create or replace function public.fila_admin_add_ticket(
  p_company_slug text,
  p_admin_pin text,
  p_number integer,
  p_name text,
  p_party_size integer
)
returns setof public.queue_tickets
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;

  return query
  insert into public.queue_tickets (company_slug, number, name, service, party_size, status)
  values (
    p_company_slug,
    p_number,
    p_name,
    case when p_party_size <= 2 then 'Mesa para 2' when p_party_size <= 4 then 'Mesa para 4' else 'Mesa para 6+' end,
    p_party_size,
    'waiting'
  )
  returning *;
end;
$$;

create or replace function public.fila_admin_update_ticket(
  p_company_slug text,
  p_admin_pin text,
  p_ticket_id uuid,
  p_status text
)
returns setof public.queue_tickets
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;
  if p_status not in ('called', 'done') then
    raise exception 'invalid_status';
  end if;

  return query
  update public.queue_tickets
  set status = p_status,
      called_at = case when p_status = 'called' then now() else called_at end
  where id = p_ticket_id and company_slug = p_company_slug
  returning *;
end;
$$;

create or replace function public.fila_admin_remove_ticket(
  p_company_slug text,
  p_admin_pin text,
  p_ticket_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;
  delete from public.queue_tickets where id = p_ticket_id and company_slug = p_company_slug;
end;
$$;

create or replace function public.fila_admin_reset_queue(
  p_company_slug text,
  p_admin_pin text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.fila_admin_authorized(p_company_slug, p_admin_pin) then
    raise exception 'admin_not_authorized';
  end if;
  delete from public.queue_tickets where company_slug = p_company_slug;
end;
$$;

alter table public.queue_companies enable row level security;
alter table public.queue_tickets enable row level security;
alter table public.trial_requests enable row level security;
alter table public.trial_tokens enable row level security;
alter table public.subscription_requests enable row level security;
alter table if exists public.queue_settings enable row level security;
alter table if exists public.ai_incidents enable row level security;
alter table if exists public.ai_incident_events enable row level security;

drop policy if exists "Public can read queue companies" on public.queue_companies;
drop policy if exists "Public can create queue companies" on public.queue_companies;
drop policy if exists "Public can update queue companies" on public.queue_companies;
drop policy if exists "Public can read queue tickets" on public.queue_tickets;
drop policy if exists "Public can create queue tickets" on public.queue_tickets;
drop policy if exists "Public can update queue tickets" on public.queue_tickets;
drop policy if exists "Public can delete queue tickets" on public.queue_tickets;
drop policy if exists "Public can read trial requests" on public.trial_requests;
drop policy if exists "Public can update trial requests" on public.trial_requests;
drop policy if exists "Public can read trial tokens" on public.trial_tokens;
drop policy if exists "Public can create trial tokens" on public.trial_tokens;
drop policy if exists "Public can update trial tokens" on public.trial_tokens;
drop policy if exists "Public can read subscription requests" on public.subscription_requests;
drop policy if exists "Public can update subscription requests" on public.subscription_requests;
drop policy if exists "Public can read queue settings" on public.queue_settings;
drop policy if exists "Public can update queue settings" on public.queue_settings;
drop policy if exists "CEO can manage queue companies" on public.queue_companies;
drop policy if exists "CEO can manage queue settings" on public.queue_settings;
drop policy if exists "CEO can read queue tickets" on public.queue_tickets;
drop policy if exists "CEO can manage trial requests" on public.trial_requests;
drop policy if exists "CEO can manage trial tokens" on public.trial_tokens;
drop policy if exists "CEO can manage subscription requests" on public.subscription_requests;
drop policy if exists "CEO can manage ai incidents" on public.ai_incidents;
drop policy if exists "CEO can manage ai incident events" on public.ai_incident_events;

create policy "CEO can manage queue companies"
  on public.queue_companies for all
  to authenticated
  using (public.fila_is_ceo())
  with check (public.fila_is_ceo());

create policy "CEO can manage queue settings"
  on public.queue_settings for all
  to authenticated
  using (public.fila_is_ceo())
  with check (public.fila_is_ceo());

create policy "Public can read active queue tickets"
  on public.queue_tickets for select
  to anon, authenticated
  using (status in ('waiting', 'called', 'done'));

create policy "Public can create waiting tickets"
  on public.queue_tickets for insert
  to anon, authenticated
  with check (status = 'waiting');

create policy "CEO can read queue tickets"
  on public.queue_tickets for select
  to authenticated
  using (public.fila_is_ceo());

create policy "Public can create trial requests"
  on public.trial_requests for insert
  to anon, authenticated
  with check (true);

create policy "CEO can manage trial requests"
  on public.trial_requests for all
  to authenticated
  using (public.fila_is_ceo())
  with check (public.fila_is_ceo());

create policy "CEO can manage trial tokens"
  on public.trial_tokens for all
  to authenticated
  using (public.fila_is_ceo())
  with check (public.fila_is_ceo());

create policy "Public can create subscription requests"
  on public.subscription_requests for insert
  to anon, authenticated
  with check (true);

create policy "CEO can manage subscription requests"
  on public.subscription_requests for all
  to authenticated
  using (public.fila_is_ceo())
  with check (public.fila_is_ceo());

create policy "CEO can manage ai incidents"
  on public.ai_incidents for all
  to authenticated
  using (public.fila_is_ceo())
  with check (public.fila_is_ceo());

create policy "CEO can manage ai incident events"
  on public.ai_incident_events for all
  to authenticated
  using (public.fila_is_ceo())
  with check (public.fila_is_ceo());

revoke all on function public.fila_is_ceo() from public;
revoke all on function public.fila_admin_authorized(text, text) from public;
revoke all on function public.fila_public_company(text) from public;
revoke all on function public.fila_admin_company(text, text) from public;
revoke all on function public.fila_trial_token_public(text) from public;
revoke all on function public.fila_activate_trial_token(text, text, text, text) from public;
revoke all on function public.fila_company_slug_exists(text) from public;
revoke all on function public.fila_ceo_reset_admin_pin(text, text) from public;

grant execute on function public.fila_is_ceo() to authenticated;
grant execute on function public.fila_admin_authorized(text, text) to anon, authenticated;
grant execute on function public.fila_public_company(text) to anon, authenticated;
grant execute on function public.fila_admin_company(text, text) to anon, authenticated;
grant execute on function public.fila_trial_token_public(text) to anon, authenticated;
grant execute on function public.fila_activate_trial_token(text, text, text, text) to anon, authenticated;
grant execute on function public.fila_company_slug_exists(text) to anon, authenticated;
grant execute on function public.fila_update_company(text, text, text, integer, integer, integer, integer, integer, integer, boolean, text, text, text, text, integer, integer, integer, text, text, text, text, text, text, text, text, text, boolean, text, text) to anon, authenticated;
grant execute on function public.fila_update_menu(text, text, boolean, text, text) to anon, authenticated;
grant execute on function public.fila_change_admin_pin(text, text, text) to anon, authenticated;
grant execute on function public.fila_ceo_reset_admin_pin(text, text) to authenticated;
grant execute on function public.fila_set_used_tables(text, text, integer, integer) to anon, authenticated;
grant execute on function public.fila_admin_add_ticket(text, text, integer, text, integer) to anon, authenticated;
grant execute on function public.fila_admin_update_ticket(text, text, uuid, text) to anon, authenticated;
grant execute on function public.fila_admin_remove_ticket(text, text, uuid) to anon, authenticated;
grant execute on function public.fila_admin_reset_queue(text, text) to anon, authenticated;

-- After creating the CEO user in Supabase Auth, authorize it with:
-- insert into public.ceo_profiles (user_id, email)
-- select id, email from auth.users where email = 'SEU_EMAIL_AQUI'
-- on conflict (user_id) do update set email = excluded.email;
