-- ───────────────────────────────────────────────────────────────────
-- Swarom — Row Level Security policies
--
-- Run AFTER schema.sql.
-- Principles:
--   - Public can READ active products and collections.
--   - Authenticated users can manage their own data (orders, wishlist,
--     addresses, reviews).
--   - Admins (role = 'admin' in profiles) can do everything.
-- ───────────────────────────────────────────────────────────────────

-- ───── Helper: is_admin() ────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ───── Enable RLS on every table ─────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.collections  enable row level security;
alter table public.products     enable row level security;
alter table public.addresses    enable row level security;
alter table public.orders       enable row level security;
alter table public.order_items  enable row level security;
alter table public.wishlist     enable row level security;
alter table public.reviews      enable row level security;
alter table public.newsletter   enable row level security;

-- ───── profiles ──────────────────────────────────────────────────
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ───── collections (public read, admin write) ────────────────────
drop policy if exists "Anyone reads collections" on public.collections;
create policy "Anyone reads collections" on public.collections
  for select using (true);

drop policy if exists "Admins write collections" on public.collections;
create policy "Admins write collections" on public.collections
  for all using (public.is_admin()) with check (public.is_admin());

-- ───── products (public read of active, admin write) ─────────────
drop policy if exists "Anyone reads active products" on public.products;
create policy "Anyone reads active products" on public.products
  for select using (status = 'active' or public.is_admin());

drop policy if exists "Admins write products" on public.products;
create policy "Admins write products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ───── addresses ──────────────────────────────────────────────
drop policy if exists "Users manage own addresses" on public.addresses;
create policy "Users manage own addresses" on public.addresses
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ───── orders ─────────────────────────────────────────────────
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users insert own orders" on public.orders;
create policy "Users insert own orders" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ───── order_items ────────────────────────────────────────────
drop policy if exists "Users read own order items" on public.order_items;
create policy "Users read own order items" on public.order_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "Insert order items with own order" on public.order_items;
create policy "Insert order items with own order" on public.order_items
  for insert with check (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

-- ───── wishlist ───────────────────────────────────────────────
drop policy if exists "Users manage own wishlist" on public.wishlist;
create policy "Users manage own wishlist" on public.wishlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ───── reviews ───────────────────────────────────────────────
drop policy if exists "Anyone reads approved reviews" on public.reviews;
create policy "Anyone reads approved reviews" on public.reviews
  for select using (approved or auth.uid() = user_id or public.is_admin());

drop policy if exists "Users insert own reviews" on public.reviews;
create policy "Users insert own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own reviews" on public.reviews;
create policy "Users update own reviews" on public.reviews
  for update using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ───── newsletter (anyone can subscribe, admins read) ───────────
drop policy if exists "Anyone can subscribe" on public.newsletter;
create policy "Anyone can subscribe" on public.newsletter
  for insert with check (true);

drop policy if exists "Admins read newsletter" on public.newsletter;
create policy "Admins read newsletter" on public.newsletter
  for select using (public.is_admin());

-- ───── Storage policies (product-images) ─────────────────────
-- Public read on the product-images bucket; admin-only write.
drop policy if exists "Public reads product images" on storage.objects;
create policy "Public reads product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());
