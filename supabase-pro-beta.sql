-- Fila Ai Pro beta: cardapio, pedidos, cozinha e comandas.
-- Aplique depois do schema base quando o beta for para restaurante real.

create table if not exists public.fila_products (
  id uuid primary key default gen_random_uuid(),
  company_slug text not null references public.queue_companies(slug) on delete cascade,
  name text not null,
  category text not null default 'Cardapio',
  description text not null default '',
  image_url text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  prep_minutes integer not null default 10 check (prep_minutes between 1 and 180),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fila_products
  add column if not exists image_url text not null default '';

create table if not exists public.fila_orders (
  id uuid primary key default gen_random_uuid(),
  company_slug text not null references public.queue_companies(slug) on delete cascade,
  table_label text not null,
  customer_name text not null,
  status text not null default 'new' check (status in ('new', 'preparing', 'ready', 'delivered', 'closed')),
  total numeric(10, 2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fila_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.fila_orders(id) on delete cascade,
  product_id uuid references public.fila_products(id) on delete set null,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists fila_products_company_active_idx
  on public.fila_products (company_slug, active, category, name);

create index if not exists fila_orders_company_status_idx
  on public.fila_orders (company_slug, status, created_at desc);

alter table public.fila_products enable row level security;
alter table public.fila_orders enable row level security;
alter table public.fila_order_items enable row level security;

grant select, insert, update, delete on public.fila_products to anon;
grant select, insert, update, delete on public.fila_orders to anon;
grant select, insert, update, delete on public.fila_order_items to anon;

-- Politicas iniciais para beta. Antes de producao, trocar escrita admin por RPC com PIN.
drop policy if exists "Public can read fila products" on public.fila_products;
create policy "Public can read fila products"
  on public.fila_products for select
  to anon
  using (true);

drop policy if exists "Anon can manage fila products" on public.fila_products;
create policy "Anon can manage fila products"
  on public.fila_products for all
  to anon
  using (true)
  with check (true);

drop policy if exists "Anon can create fila orders" on public.fila_orders;
create policy "Anon can create fila orders"
  on public.fila_orders for insert
  to anon
  with check (status = 'new');

drop policy if exists "Public can read fila orders" on public.fila_orders;
create policy "Public can read fila orders"
  on public.fila_orders for select
  to anon
  using (true);

drop policy if exists "Anon can update fila orders" on public.fila_orders;
create policy "Anon can update fila orders"
  on public.fila_orders for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Anon can create fila order items" on public.fila_order_items;
create policy "Anon can create fila order items"
  on public.fila_order_items for insert
  to anon
  with check (true);

drop policy if exists "Public can read fila order items" on public.fila_order_items;
create policy "Public can read fila order items"
  on public.fila_order_items for select
  to anon
  using (true);
