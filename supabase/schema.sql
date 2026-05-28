-- ───────────────────────────────────────────────────────────────────
-- Swarom — Database schema (Phase 1)
--
-- Run this in your Supabase project SQL editor.
-- Order:
--   1. schema.sql          ← creates tables, enums, functions, triggers
--   2. policies.sql        ← row-level-security policies
--   3. seed.sql (optional) ← sample products to get going
-- ───────────────────────────────────────────────────────────────────

-- ───── Extensions ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ───── Enums ────────────────────────────────────────────────────
do $$ begin
  create type product_category as enum ('pendant', 'ring', 'bracelet', 'anklet', 'for-two');
exception when duplicate_object then null; end $$;

do $$ begin
  create type product_status as enum ('draft', 'active', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'pending', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

-- ───── profiles ─────────────────────────────────────────────────
-- Mirrors auth.users with brand-specific fields. One row per user.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        user_role default 'customer' not null,
  created_at  timestamptz default now() not null
);

-- Auto-create a profile when a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───── collections ──────────────────────────────────────────────
create table if not exists public.collections (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  description text,
  position    integer default 0 not null,
  created_at  timestamptz default now() not null
);

-- ───── products ─────────────────────────────────────────────────
create table if not exists public.products (
  id                uuid primary key default uuid_generate_v4(),
  slug              text unique not null,
  name              text not null,
  modifier          text,
  description       text,
  collection_id     uuid references public.collections(id) on delete set null,
  category          product_category not null,
  price             integer not null check (price >= 0),                  -- rupees
  compare_at_price  integer check (compare_at_price is null or compare_at_price >= price),
  status            product_status default 'active' not null,
  meta              text,
  image_main        text,
  images            text[] default '{}'::text[] not null,
  options           jsonb default '{}'::jsonb not null,
  inventory         integer,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_collection_idx on public.products(collection_id);

-- ───── addresses ────────────────────────────────────────────────
create table if not exists public.addresses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  full_name   text not null,
  phone       text not null,
  line1       text not null,
  line2       text,
  city        text not null,
  state       text not null,
  pincode     text not null,
  country     text default 'India' not null,
  is_default  boolean default false not null,
  created_at  timestamptz default now() not null
);
create index if not exists addresses_user_idx on public.addresses(user_id);

-- ───── orders ───────────────────────────────────────────────────
create table if not exists public.orders (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references auth.users(id) on delete set null,
  email                 text not null,
  phone                 text,
  status                order_status default 'pending' not null,
  subtotal              integer not null check (subtotal >= 0),
  shipping              integer default 0 not null,
  tax                   integer default 0 not null,
  total                 integer not null check (total >= 0),
  currency              text default 'INR' not null,
  shipping_address      jsonb not null,
  razorpay_order_id     text,
  razorpay_payment_id   text,
  notes                 text,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ───── order_items ──────────────────────────────────────────────
create table if not exists public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references public.orders(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete set null,
  name        text not null,                    -- snapshot
  modifier    text,                             -- snapshot
  image       text,                             -- snapshot
  unit_price  integer not null,                 -- snapshot
  quantity    integer not null check (quantity > 0),
  options     jsonb default '{}'::jsonb not null
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ───── wishlist ────────────────────────────────────────────────
create table if not exists public.wishlist (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete cascade not null,
  created_at  timestamptz default now() not null,
  unique (user_id, product_id)
);

-- ───── reviews ─────────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references public.products(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete set null,
  rating      integer not null check (rating between 1 and 5),
  title       text,
  body        text,
  approved    boolean default false not null,
  created_at  timestamptz default now() not null
);
create index if not exists reviews_product_idx on public.reviews(product_id);

-- ───── newsletter ──────────────────────────────────────────────
create table if not exists public.newsletter (
  id          uuid primary key default uuid_generate_v4(),
  email       text unique not null,
  source      text,
  created_at  timestamptz default now() not null
);

-- ───── updated_at trigger ─────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ───── Storage bucket for product images ──────────────────────
-- Run this in the Supabase dashboard Storage UI, or via the SQL below:
-- (`storage` schema management via SQL is supported in Supabase v2+)
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;
