# Swarom — Design System

> _Your story, told in silver._

Swarom is a personalized 925 sterling silver jewellery brand, handcrafted in **Bengaluru**, **est. 2026**. Made to order. Made to last. The brand currently lives at [swarom.in](https://www.swarom.in/) as a "coming soon" / waitlist site; the wider product surface (full catalogue, customizer, checkout) is in design.

This repository is the source of truth for Swarom's visual and content language: tokens, typography, iconography, voice, and a set of pixel-faithful React UI components ready to drop into mocks, slides, and throwaway prototypes.

---

## Sources used to build this system

- **Live site (waitlist)** — <https://www.swarom.in/>
- **Codebase** — `swarom_jewellary/` (Next.js 14 + Tailwind, mounted via File System Access). Key files mirrored under `reference/` for offline access:
  - `reference/swarom_page.tsx` — the live landing page
  - `reference/swarom_globals.css` — grain, shimmer, float utilities
  - `reference/swarom_tailwind.config.ts` — full brand palette + tokens
- **Style reference** — <https://mentisjewellery.gr> (heritage, hairline, italic-serif, hush of luxury). Swarom is not a clone — it's the same _register_ rendered with a warmer, more personal voice.

---

## File index

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← Claude Code skill manifest
├── colors_and_type.css        ← all tokens (CSS vars) + semantic type classes
├── assets/
│   ├── swarom-wordmark.svg    ← primary lockup
│   ├── swarom-monogram.svg    ← dark "S" monogram (favicon-shaped)
│   ├── swarom-monogram-cream.svg
│   ├── icons.svg              ← hairline icon sprite (currentColor)
│   ├── favicon.svg            ← from the codebase
│   ├── product-pendant.svg    ← placeholder product still
│   ├── product-ring.svg
│   ├── product-bracelet.svg
│   └── hero-still-life.svg    ← placeholder hero composition
├── preview/                   ← cards for the Design System tab
├── reference/                 ← read-only mirror of source assets
└── ui_kits/
    └── website/               ← the swarom.in marketing + commerce surface
        ├── index.html
        ├── README.md
        └── *.jsx
```

---

## Content fundamentals

Swarom's copy is **quiet, warm, and intimate**. It reads like a hand-written gift card, not an ad. Every line is short, every claim is small, every promise is concrete. The voice should feel like a single person speaking, never a brand.

### Voice rules

- **Tense & person.** Mostly first-plural ("we'll be in touch", "we open doors") and second-person ("your story", "your name"). Almost never "I". The brand and the maker are one.
- **Sentences are short.** Three-to-eight words. Then a period. Then another short one. The rhythm matters more than the information density.
- **Concrete over abstract.** "Handcrafted in Bengaluru." beats "Artisanally produced in India." Always pick the named, specific noun.
- **Numbers as proof.** "925 sterling silver." "Est. 2026." "Made to order." The numbers do the credentialing — don't write the word "premium".
- **Capitalisation.** Sentence case in body. **UPPERCASE + .2em tracking** only for eyebrows, nav, and meta (`COMING SOON`, `BENGALURU · EST. 2026`, `© 2026 SWAROM`).
- **Punctuation.** Use the **·** (middot) as a delicate separator in eyebrows: `BENGALURU · EST. 2026`. Use **em dashes** in body copy — never double hyphens. Use **&** only inside lockups (Made & Loved), not in sentences.
- **Italics carry the feeling.** The tagline is italic serif. Reserve italics for short emotional lines. Don't italicize body copy.
- **No emoji. No exclamation marks.** Ever. The brand smiles with its eyes.
- **No buzzwords.** Avoid "elevate", "curate", "luxury", "exquisite", "timeless", "elegance" — every other jewellery brand uses these. Swarom uses _silver_, _story_, _made_, _hand_, _name_, _last_.

### Reference lines (lifted from the live site)

- Tagline · _Your story, told in silver._
- Lede · "Personalized 925 sterling silver jewellery, handcrafted in Bengaluru. Made to order. Made to last."
- CTA · "Notify me" (never "Subscribe", never "Get updates")
- Form success · "You're on the list. We'll be in touch when we open doors."
- Footer eyebrow · "© 2026 SWAROM"
- Nav eyebrow · "BENGALURU · EST. 2026"

### Naming patterns

- Collections take warm, lowercase names: `the everyday`, `letters`, `keepsake`, `for two`.
- Products take a noun, then italicised personal modifier: **Pendant** _in your hand_. **Ring** _for the second one_.
- Material is always written out: **925 sterling silver**, not _silver_.

---

## Visual foundations

### Palette

Warm paper + ink + a single warm gold accent. Silvers exist as cool neutrals but are never used as a flat fill — they appear as product material, in subtle gradients, or as hairline rules.

| Token | Hex | Role |
|---|---|---|
| `--cream` | `#F6F1EA` | Default page background. Warm, slightly pink-beige. |
| `--cream-50` | `#FBF8F4` | Lightest surface — cards on cream. |
| `--cream-200` | `#EDE3D4` | Hover surfaces, deeper paper. |
| `--charcoal` | `#1F1B16` | Body text, buttons, wordmark. Not pure black. |
| `--silver` | `#C9C7C2` | Reserved for material references. |
| `--gold` | `#B8956A` | The **only** accent. Used at hairline width and small mark scale. |
| `--success` | `#5A6B3F` | Moss — botanical, not bright. |
| `--error` | `#8B2E2E` | Oxidised silver red. |

The interface is **~95% cream + charcoal**, with gold appearing only at hairline weights (1px lines, shimmer underlines, single-character marks). Never use gold as a fill. Never use a coloured gradient larger than a 12px-radius orb.

### Typography

- **Display & wordmark** — **Playfair Display**, 400/500/600/700. High-contrast classic serif (modern, Didot-adjacent). Set at a regular weight (400) for headlines — the contrast does the work, not the heft. Italics carry pull-quotes and short emotional lines.
- **Body & UI** — **Montserrat**, 200/300/400/500/600. Geometric sans, kept _light_ and _wide_ (letter-spacing 0.01–0.02em on body, 0.22em on eyebrows). Body sits at 14–15px; lede at 15px Light 300; eyebrows at 11–13px Regular 400 UPPERCASE.
- **Signature script** — **Great Vibes** (free Google Fonts substitute; the Mentis reference uses commercial **Brittany Signature** / **Autography**). Always rendered in **gold** (`--gold`) at 40–64px, often rotated slightly (−2°) to feel hand-drawn. Used **once per page maximum** — typically as a sub-tagline, a section sigil, or the founder signature.
- **Eyebrows / nav / meta** — Montserrat 400, **11–13px**, UPPERCASE, **letter-spacing .22em**. This is one of the most distinctive marks of the brand and should appear everywhere structural — page headers, footers, section labels, button text.
- **Price** — Playfair Display 400 at 22–24px with `+0.04em` tracking. Italic optional. Always prefixed with `₹`.

See `colors_and_type.css` for the full semantic class set (`.swr-display`, `.swr-h1…h4`, `.swr-signature`, `.swr-tagline`, `.swr-lede`, `.swr-body`, `.swr-eyebrow`, `.swr-price`).

### Backgrounds & texture

- Default page background is **flat cream** (`--cream`), never a gradient, **always with the subtle grain overlay** (`.swr-grain`, opacity 0.04, SVG fractalNoise). The grain is what gives surfaces their paper feel — never omit it on hero sections.
- Hero sections and product detail pages get **two ambient orbs**: one warm cream→silver-light orb top-right, one gold→cream orb bottom-left. Both at ~60% opacity, blur-3xl, floating with a 6s ease-in-out cycle. They are the only "decorative" element in the system.
- **No full-bleed colour gradients.** No bluish-purple. No mesh.
- Imagery (product) skews **warm, soft-focus, daylight**. Cream-linen surfaces. Hand and skin always welcome. Never high-contrast studio. Never black backdrop.

### Motion

- **Easing** — `cubic-bezier(0.22, 0.61, 0.36, 1)` for entrances, `cubic-bezier(0.65, 0, 0.35, 1)` for state changes. Never linear, never bouncy.
- **Durations** — 150ms (state), 250ms (default), 600ms (entrance reveal), 4s (ambient shimmer/float).
- **Allowed motions** — fade-up (8–16px), opacity, the shimmer-underline pulse, the orb float. **Never** slide, never spring/bounce, never parallax.
- Reduce-motion friendly — orbs and shimmer must be disabled under `@media (prefers-reduced-motion)`.

### Interactive states

- **Hover (buttons)** — background steps from `--charcoal` to `--charcoal-800` (a hair lighter). Underlines on text links fade in from 0 to 100% over 150ms.
- **Hover (text links)** — colour fades from `--fg2` to `--fg1`. No underline default; optional 1px hairline underline at `--gold`.
- **Press** — `transform: scale(0.98)` over 150ms. No colour change beyond hover.
- **Focus** — 2px outline at `rgba(184, 149, 106, 0.4)` (gold @ 40%) offset by 2px. Never a default blue ring.
- **Disabled** — 50% opacity. No greying out the colour itself.

### Borders, hairlines & dividers

- The default border is a **1px hairline** at `rgba(31, 27, 22, 0.15)` (`--hairline`). Buttons, inputs, and cards use this — never a heavier weight.
- Dividers inside content are a **1px hairline** with **fade-to-transparent** at both ends (the `.swr-hairline-rule` utility): a 32px line, the label, a 32px line.
- A **gold hairline** (1px `--gold`) is reserved for the wordmark underline and rare product detail accents (e.g., the "925" stamp ring).

### Shadows & elevation

Warm, low-contrast. Never blue-tinted. Built from layered low-alpha charcoal.

- `--shadow-soft` — small interactive lift (1px tight + 8/24px wide).
- `--shadow-card` — product cards / panels.
- `--shadow-lift` — modals, focused product view, opened menus.

### Corner radii

- **Pills** (`--radius-pill`, 999px) for buttons, inputs, badges. This is the default in this system — most interactive elements are pill-shaped.
- **14px / 24px** (`--radius-lg`, `--radius-xl`) for cards and product tiles.
- **4–8px** (`--radius-sm`, `--radius-md`) for sub-elements inside cards.

### Cards & surfaces

- Cards sit on `--cream-50` with a 1px `--hairline` border and `--shadow-soft`.
- Product tiles are **borderless** on cream — they rely on the product image and a clean caption stack. No shadow, no border, no rounded corners on the image itself (the image is the silhouette).
- Avoid the "rounded corners with colored left-border accent" pattern — it is not part of this system.

### Layout rules

- **Container max-widths** — 1280px for marketing, 1080px for catalogue grid, 720px for editorial / lookbook copy.
- **Vertical rhythm** — sections separated by ≥ 96px (`--s-24`) on desktop, 64px (`--s-16`) on mobile.
- **Fixed elements** — only the header (transparent over hero, cream + hairline on scroll). No fixed footer, no chat bubble, no sticky CTA.
- **Use of transparency & blur** — the only blur in the system is on background orbs (`blur-3xl`). Never use backdrop-filter / glass.

### Layout grid (web)

12 columns, 24px gutters at desktop. Hero compositions use **asymmetric two-column** layouts (text 5/12, image 7/12) — never centered cards.

---

## Iconography

Swarom uses a small, **hand-rolled hairline icon set** built into the codebase itself (see `src/app/page.tsx` — `Sparkle`, `Heart`, `Leaf`). The traits are consistent and the set is intentionally tiny — _three_ icons appear on the live site.

**Traits:**

- 24×24 viewBox, drawn live at 16px.
- 1.4 stroke-width.
- `stroke-linecap="round"` and `stroke-linejoin="round"`.
- `currentColor` strokes — the icon takes the surrounding text colour. Never filled.
- Used at low opacity (`text-charcoal/55`) above a tiny uppercase label.

**No external icon library.** No Lucide, Heroicons, Material, Phosphor. The whole vocabulary should feel hand-drawn.

**No emoji.** Anywhere. Ever.

**No unicode pictographs** (★, ♥, etc.) as icons. Use the SVG sprite.

`assets/icons.svg` is the canonical hairline sprite for this system — it expands the set beyond the three on the live site (sparkle, heart, leaf) with the same traits: `bag`, `search`, `user`, `arrow-right`, `arrow-up-right`, `plus`, `minus`, `menu`, `close`, `instagram`, `whatsapp`, `mail`, `shield`, `ring`, `stamp` (the 925 medallion), `truck`, `chevron-down`, `chevron-right`, `check`. Use via `<svg><use href="assets/icons.svg#swr-bag"/></svg>`.

> **Substitution flag.** The three core icons in `src/app/page.tsx` were drawn freehand — the additions in `assets/icons.svg` were drawn to match their traits, _not_ lifted from any library. If you'd like a published set (e.g., Phosphor Thin or Tabler 1.5) swapped in as a base, flag this and we'll re-export.

---

## Fonts

All three families load from **Google Fonts** at the top of `colors_and_type.css`:

- **Playfair Display** — the serif display face. High-contrast modern serif in the Didot lineage.
- **Montserrat** — the sans-serif for UI, nav, and body. Geometric, kept light + wide.
- **Great Vibes** — the gold signature script (substitute — see flag below).

No `.woff2` files are bundled; the Google Fonts CDN is the canonical source.

> **⛑ Substitution flag — signature script.** The Mentis-style reference uses a commercial signature script (most likely **Brittany Signature**, **Autography**, or **Photographer**). Those are licensed Creative Market faces and can't be redistributed. **Great Vibes** is the closest free Google-Fonts alternative — same monoline, romantic handwritten feel, slightly different stylistic strokes. If you license the commercial face, drop the `.woff2` in `fonts/` and point `--font-script` at it; everything else stays the same.

> **⛑ Alternates.** If Playfair Display ever feels too high-contrast, candidates are **Cormorant Garamond** (slimmer, what the live waitlist used), **EB Garamond**, **Cardo**, or **Forum**. If Montserrat reads too utilitarian, candidates are **Jost** or **Futura** (commercial).

---

## UI kits

- **`ui_kits/website/`** — the consumer-facing surface of swarom.in. Header / nav, hero, product grid, product detail, lookbook story block, waitlist module, footer. Mostly cosmetic React components with light click-through interactivity (open menu, add to bag, swap photo). See `ui_kits/website/README.md`.

(No mobile app, dashboard, or admin tool exists yet — the brand is in waitlist phase. If those surfaces get designed, they'll live as additional kits.)

---

## Caveats & substitutions

- **Three icons** exist in the actual codebase. The expanded sprite is "in the spirit of" — flag if you want it reduced.
- **Product photography is placeholder.** The SVG stills in `assets/` (`product-pendant.svg`, `product-ring.svg`, `product-bracelet.svg`) are silver-droplet stand-ins — once real photography exists, drop it in `assets/products/` and update the UI kit.
- **Logo lockup** is a typeset wordmark in Cormorant Garamond with a 1px gold underline — there is no graphic mark in the codebase beyond the favicon "S".
- **Fonts are CDN-loaded** from Google Fonts. No local `.woff2` is bundled.

---

## Quick start (in another project)

```html
<link rel="stylesheet" href="colors_and_type.css">
<body class="swr-grain" style="background: var(--bg); color: var(--fg1);">
  <span class="swr-eyebrow">Bengaluru · Est. 2026</span>
  <h1 class="swr-h0">Swarom</h1>
  <p class="swr-tagline">Your story, told in silver.</p>
  <p class="swr-lede">Personalized 925 sterling silver jewellery, handcrafted in Bengaluru.</p>
</body>
```
