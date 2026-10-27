-- ───────────────────────────────────────────────────────────────────
-- Swarom — Migration 002: the gold line
--
-- Adds weight-based pricing alongside the existing fixed-price silver
-- catalogue. Run AFTER schema.sql + policies.sql, in the Supabase SQL
-- editor. Safe to re-run.
--
-- Why this exists: gold is not sold at a fixed price. The price is
--   (net weight × today's rate) + wastage + making + stones + tax,
-- and the rate moves daily. `products.price` stays as the cached result
-- so existing sorts and filters keep working — it is recomputed when a
-- new rate is published.
-- ───────────────────────────────────────────────────────────────────

-- ───── STEP 1 ─────────────────────────────────────────────────────
-- Enum values must be committed before anything can use them. If you
-- are pasting this whole file at once and Postgres complains, run this
-- block on its own first, then the rest.

alter type product_category add value if not exists 'necklace';
alter type product_category add value if not exists 'haram';
alter type product_category add value if not exists 'earrings';
alter type product_category add value if not exists 'bangle';
alter type product_category add value if not exists 'mangalsutra';

do $$ begin
  create type metal_kind as enum (
    'silver_925', 'gold_14k', 'gold_18k', 'gold_22k', 'gold_24k'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type making_charge_kind as enum ('per_gram', 'percentage', 'flat');
exception when duplicate_object then null; end $$;

-- ───── STEP 2 · product columns ───────────────────────────────────

alter table public.products
  add column if not exists metal            metal_kind  not null default 'silver_925',
  add column if not exists pricing_mode     text        not null default 'fixed',
  add column if not exists gross_weight     numeric(9,3),
  add column if not exists net_weight       numeric(9,3),
  add column if not exists wastage_pct      numeric(5,2) not null default 0,
  add column if not exists making_charge_type  making_charge_kind not null default 'per_gram',
  add column if not exists making_charge_value numeric(10,2) not null default 0,
  add column if not exists stone_charges    integer     not null default 0,
  add column if not exists stone_details    jsonb       not null default '[]'::jsonb,
  add column if not exists hallmark_huid    text,
  add column if not exists supplier_code    text,
  add column if not exists price_updated_at timestamptz;

do $$ begin
  alter table public.products
    add constraint products_pricing_mode_check
    check (pricing_mode in ('fixed', 'weight_based'));
exception when duplicate_object then null; end $$;

-- A weight-based piece is meaningless without a net weight.
do $$ begin
  alter table public.products
    add constraint products_weight_required
    check (pricing_mode = 'fixed' or net_weight is not null);
exception when duplicate_object then null; end $$;

-- Net metal can never exceed the gross weight of the finished piece.
do $$ begin
  alter table public.products
    add constraint products_weight_sane
    check (gross_weight is null or net_weight is null or net_weight <= gross_weight);
exception when duplicate_object then null; end $$;

create index if not exists products_metal_idx on public.products(metal);
create index if not exists products_pricing_mode_idx on public.products(pricing_mode);

comment on column public.products.price is
  'Rupees. For pricing_mode = ''weight_based'' this is a CACHE of the last
   computed price — recompute it whenever a new metal rate is published.';
comment on column public.products.net_weight is
  'Grams of metal, excluding stones. This is what the metal rate multiplies.';
comment on column public.products.hallmark_huid is
  'BIS HUID, assigned per physical piece. Null until the piece is made.';

-- ───── STEP 3 · daily metal rates ─────────────────────────────────

create table if not exists public.metal_rates (
  id             uuid primary key default uuid_generate_v4(),
  metal          metal_kind not null,
  rate_per_gram  numeric(12,2) not null check (rate_per_gram > 0),
  effective_from timestamptz not null default now(),
  note           text,
  created_at     timestamptz not null default now()
);

create index if not exists metal_rates_lookup
  on public.metal_rates(metal, effective_from desc);

comment on table public.metal_rates is
  'Append-only. The current rate for a metal is the newest row whose
   effective_from is in the past. Never update a row — insert a new one,
   so historical orders can be reconciled against the rate of the day.';

-- ───── STEP 4 · store settings ────────────────────────────────────

create table if not exists public.store_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Confirm these against your own accountant before going live.
insert into public.store_settings (key, value) values
  ('gst_pct_jewellery', '3'::jsonb),
  ('gst_pct_making',    '5'::jsonb),
  ('price_rounding',    '10'::jsonb)
on conflict (key) do nothing;

-- ───── STEP 5 · row level security ────────────────────────────────

alter table public.metal_rates    enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "Anyone reads metal rates" on public.metal_rates;
create policy "Anyone reads metal rates" on public.metal_rates
  for select using (true);

drop policy if exists "Admins write metal rates" on public.metal_rates;
create policy "Admins write metal rates" on public.metal_rates
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone reads settings" on public.store_settings;
create policy "Anyone reads settings" on public.store_settings
  for select using (true);

drop policy if exists "Admins write settings" on public.store_settings;
create policy "Admins write settings" on public.store_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ───── STEP 6 · order snapshots ───────────────────────────────────
-- An order must record what the metal was worth on the day, or a
-- refund six months later is unarguable.

alter table public.order_items
  add column if not exists metal           metal_kind,
  add column if not exists net_weight      numeric(9,3),
  add column if not exists rate_per_gram   numeric(12,2),
  add column if not exists price_breakdown jsonb;

comment on column public.order_items.price_breakdown is
  'Frozen at purchase: metal value, wastage, making, stones, tax.';
