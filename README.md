# Swarom

Personalized 925 sterling silver jewellery — handcrafted in Bengaluru.

**Live site:** https://swarom.in

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Domain:** swarom.in

---

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you should see the Coming Soon page.

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # check code style
```

---

## Going live — first deploy (one-time setup)

### 1. Push to GitHub

This folder is already a git repo (`.git` exists). Stage everything and push:

```bash
cd /Users/amansingh/Documents/GitHub/swarom_jewellary
git add .
git commit -m "Initial commit — Coming Soon page"
git branch -M main
git remote add origin https://github.com/<your-username>/swarom_jewellary.git
git push -u origin main
```

If you haven't created the GitHub repo yet:
1. Go to https://github.com/new
2. Repo name: `swarom_jewellary`
3. Keep it **private** for now (you can flip to public later)
4. **Don't** initialize with README / .gitignore — this folder already has them
5. Click **Create repository**, then run the `git remote add` + `git push` commands above

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. **Import** the `swarom_jewellary` repo
4. Framework Preset: **Next.js** (auto-detected)
5. Leave all build settings default
6. Click **Deploy**

In ~60 seconds you'll have a live URL like `swarom-jewellary.vercel.app`. Every `git push` after this auto-deploys.

### 3. Point swarom.in at Vercel

In Vercel project → **Settings → Domains → Add**, type `swarom.in` and also add `www.swarom.in`.

Vercel will show you DNS records to add. There are two paths depending on what your registrar (where you bought swarom.in) allows:

**Option A — Nameservers (recommended, simpler):**
At your domain registrar's dashboard, change nameservers to Vercel's:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B — DNS records (if you want to keep your registrar's nameservers):**
Add these at your registrar:
- `A` record: `@` → `76.76.21.21`
- `CNAME` record: `www` → `cname.vercel-dns.com`

DNS propagation takes 5 minutes to a few hours. Vercel will auto-issue an SSL cert once it sees the records.

---

## Project structure

```
src/
  app/
    layout.tsx        # Root layout, fonts, metadata
    page.tsx          # Coming Soon page
    globals.css       # Tailwind + brand styles
public/
  favicon.svg         # Brand mark
tailwind.config.ts    # Brand colors (cream / charcoal / silver / gold)
```

---

## Brand palette

| Color    | Hex       | Use                          |
|----------|-----------|------------------------------|
| Cream    | `#F6F1EA` | Background                   |
| Charcoal | `#1F1B16` | Text, buttons                |
| Silver   | `#C9C7C2` | Accents, borders             |
| Gold     | `#B8956A` | Highlights, shimmer line     |

---

## Roadmap

- [x] Coming Soon page live at swarom.in
- [ ] Logo finalized
- [ ] Wire email capture to a real list (Klaviyo / Sheets / Resend)
- [ ] Product catalog page with first 6–8 SKUs
- [ ] Custom name pendant builder
- [ ] Checkout (Razorpay)
- [ ] Order tracking + WhatsApp updates
