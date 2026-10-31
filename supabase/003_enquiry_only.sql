-- 003 · Enquiry-only pieces
--
-- A piece can now be published without being purchasable. Gold is priced
-- off the day's rate and a net weight; until those exist the piece may be
-- shown and asked about, but not bought.
--
-- Safe to re-run.

alter table public.products
  add column if not exists enquiry_only boolean not null default false;

comment on column public.products.enquiry_only is
  'Published but not purchasable: no price is shown and the buy button is
   replaced by an enquiry. Set this for any piece whose purity, net weight
   or stone detail is not yet confirmed. The order action refuses these.';

create index if not exists products_enquiry_only_idx
  on public.products(enquiry_only) where enquiry_only;

-- Belt and braces: nothing purchasable may carry a zero price. An
-- enquiry-only piece is exempt, because it has no price by design.
alter table public.products
  drop constraint if exists products_priced_if_buyable;

alter table public.products
  add constraint products_priced_if_buyable
  check (enquiry_only or status <> 'active' or price > 0);
