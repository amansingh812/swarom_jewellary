# Swarom

Personalized 925 sterling silver jewellery, handcrafted in Bengaluru.

**Live site:** https://swarom.in  ·  **Tagline:** _Your story, told in silver._

---

## Tech stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS (extended with Swarom brand tokens)
- **Backend / DB / Auth:** Supabase (Postgres + Row-Level Security + Storage)
- **Payments (Phase 1.5):** Razorpay
- **Hosting:** Vercel
- **Fonts:** Playfair Display · Montserrat · Great Vibes (via `next/font/google`)

---

## Quick start

```bash
npm install
cp .env.local.example .env.local      # then fill in Supabase keys
npm run dev
```

Open http://localhost:3000.

> The site works **without** Supabase configured — `lib/products.ts` falls back
> to a mock catalog so you can develop visually before wiring the database.
> Auth and account pages become inert until env vars are set.

---

## Project structure

```
swarom_jewellary/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← root layout + fonts + metadata
│   │   ├── globals.css             ← brand tokens + semantic type classes
│   │   ├── (site)/                 ← public storefront route group
│   │   │   ├── layout.tsx          ← Header + Footer + BagDrawer + providers
│   │   │   ├── page.tsx            ← Home
│   │   │   ├── shop/               ← Catalog + filters
│   │   │   ├── product/[slug]/     ← Product detail w/ live engraving
│   │   │   ├── collections/        ← Collection index
│   │   │   ├── story/              ← About
│   │   │   ├── care/               ← Care guide
│   │   │   ├── cart/               ← Full cart page
│   │   │   ├── checkout/           ← Address + payment flow
│   │   │   ├── auth/               ← login / signup / forgot
│   │   │   └── account/            ← Dashboard, orders, addresses, wishlist
│   │   ├── (admin)/                ← Phase 2 admin route group
│   │   │   ├── layout.tsx          ← Server-side admin role gate
│   │   │   └── admin/              ← Dashboard, products, orders, customers
│   │   ├── auth/callback/          ← Supabase OAuth + magic-link return
│   │   └── coming-soon/            ← The old waitlist page (kept around)
│   ├── components/
│   │   ├── site/                   ← Header, MobileMenu, Footer, BagDrawer, …
│   │   └── ui/                     ← Button, Icon, Pill, Eyebrow, ShimmerLine
│   ├── lib/
│   │   ├── supabase/               ← Browser + server clients + types + middleware
│   │   ├── auth/AuthProvider.tsx   ← React context for the session
│   │   ├── cart/                   ← Cart context (localStorage-backed)
│   │   ├── products.ts             ← Data layer (Supabase or mock)
│   │   └── money.ts                ← ₹ formatter
│   └── middleware.ts               ← Refreshes Supabase session cookies
├── public/
│   ├── brand/                      ← Wordmark, monogram, icons sprite, signature
│   ├── products/                   ← Placeholder product imagery (swap for real)
│   └── favicon.svg
├── supabase/
│   ├── schema.sql                  ← Tables, enums, functions, triggers
│   ├── policies.sql                ← Row-Level Security
│   └── seed.sql                    ← Collections + 8 sample products
├── swarom-design-system/           ← Handoff bundle (the design source of truth)
├── tailwind.config.ts              ← Brand palette + motion tokens
└── .env.local.example
```

---

## Brand palette

| Token              | Hex       | Role                              |
| ------------------ | --------- | --------------------------------- |
| `cream`            | `#F6F1EA` | Page background                   |
| `cream-50`         | `#FBF8F4` | Card surfaces                     |
| `cream-200`        | `#EDE3D4` | Hover surfaces, deeper paper      |
| `charcoal`         | `#1F1B16` | Text, buttons, wordmark           |
| `silver` / `light` | `#C9C7C2` | Reserved for material references  |
| `gold`             | `#B8956A` | The only accent — hairline only   |
| `moss`             | `#5A6B3F` | Success                           |
| `oxide`            | `#8B2E2E` | Error                             |

Voice: short sentences, italic taglines, **·** middots in eyebrows, no emoji, no
buzzwords. See `swarom-design-system/project/README.md` for the full system.

---

## Supabase setup (one-time)

### 1. Create the project

1. Go to https://supabase.com → new project. Name it `swarom`. Region: closest to India (Singapore or Mumbai).
2. Once provisioned, go to **Project Settings → API**. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, keep secret)
3. Paste those into `.env.local`.

### 2. Run the schema

In Supabase **SQL Editor**, run in this order:

```
supabase/schema.sql     ← tables, enums, triggers
supabase/policies.sql   ← row-level security
supabase/seed.sql       ← sample products (optional)
```

### 3. Enable auth providers

In Supabase **Authentication → Providers**, enable:

- **Email** (already on)
- **Google** — set redirect URL to `https://swarom.in/auth/callback` (and `http://localhost:3000/auth/callback` for dev)
- **Phone** — pick Twilio or MessageBird as provider (optional, ~₹0.30/SMS in India)

### 4. Make yourself an admin

After you sign up via the site, in the SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOU@example.com');
```

Now `/admin` is accessible to your account only.

---

## Going live — first deploy

### 1. Push to GitHub

```bash
git add .
git commit -m "Storefront v1 — design system implemented"
git push -u origin main
```

(If the remote isn't set up yet, see the original setup commands.)

### 2. Deploy to Vercel

1. https://vercel.com/new → import the `swarom_jewellary` repo
2. Framework Preset: **Next.js** (auto-detected)
3. **Environment Variables** — paste every key from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://swarom.in`
   - (Razorpay keys once you have an account)
4. **Deploy**. First build takes ~60s.

### 3. Point swarom.in at Vercel

Project → **Settings → Domains → Add** `swarom.in` and `www.swarom.in`.
Then at your domain registrar, either change nameservers to:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

…or add the records Vercel shows (an A record + a CNAME).

---

## Roadmap

### Phase 1 — Storefront (current)

- [x] Design system implemented (tokens, type, motion, components)
- [x] Mobile-first layout throughout
- [x] Home, Shop, Product Detail, Collections, Story, Care
- [x] Cart + Checkout flow scaffolded
- [x] Auth (Email + Google + Phone OTP) via Supabase
- [x] Account pages: orders, wishlist, addresses, settings
- [x] Supabase schema + RLS + seed data
- [ ] Real product photography
- [ ] Razorpay integration (replace simulation in `Checkout.tsx`)
- [ ] Newsletter wire-up to `newsletter` table (currently localStorage)
- [ ] Wishlist + reviews wire-up
- [ ] Order confirmation email (Resend)
- [ ] WhatsApp order updates

### Phase 2 — Admin (scaffolded)

- [x] `/admin` route group with role gate
- [x] Sidebar nav, dashboard, products/orders/customers/newsletter tables
- [ ] Product CRUD with image upload to Supabase Storage
- [ ] Order detail page with status timeline
- [ ] Customer drill-down with order history
- [ ] Basic analytics (sales by week, top pieces)
- [ ] Print packing slip
- [ ] Custom-design request inbox

### Phase 3 — Marketing & retention

- [ ] Klaviyo (or Resend) marketing emails
- [ ] Instagram Shop catalog feed
- [ ] Referral / gift card system
- [ ] Reviews → schema.org integration for Google rich snippets

---

## Useful commands

```bash
npm run dev         # local dev server
npm run build       # production build (Next prerenders static pages)
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```
