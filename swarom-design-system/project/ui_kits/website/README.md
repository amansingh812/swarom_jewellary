# Swarom Website — UI Kit

A pixel-faithful recreation of the swarom.in consumer surface. Built directly from the codebase at `swarom_jewellary/` (the live site is currently a waitlist page; this kit extends the same vocabulary into the full marketing + commerce surface that's in design).

## What's in here

- **`index.html`** — entry point. Boots React via Babel and mounts the click-through prototype.
- **`kit.css`** — all styles for the kit. Imports `colors_and_type.css` from the repo root.
- **`Header.jsx`** — split-justified nav with a centered serif wordmark, plus an eyebrow announcement strip.
- **`Footer.jsx`** — four-column footer with newsletter capture.
- **`Home.jsx`** — landing page: hero with ambient orbs, three-step process band, product grid, story strip. Also exports `ProductTile` and the `HOME_PRODUCTS` data.
- **`Shop.jsx`** — collection page with filter / sort pills and a wider product grid.
- **`ProductDetail.jsx`** — PDP with a thumbnail rail, large image, engraving input with live preview, chain-length chips, accordions, and WhatsApp link.
- **`Story.jsx`** — editorial / about page with founder note and press strip.
- **`BagDrawer.jsx`** — right-side drawer triggered by the bag button or by adding to bag.
- **`App.jsx`** — string-routed state container.

## Click-through

Open `index.html` and you can:

1. Land on the home page (hero + collection grid + story strip).
2. Click **Shop the collection**, the cart icon, or any product tile to navigate.
3. Open the PDP. Type a new engraving — see it reflected in the live preview. Pick a chain length. Click **Add to bag** — the bag drawer opens with your engraved configuration.
4. Browse the **Shop** page from the nav.
5. Visit the **Story** page.

## Faithful to the codebase

Reused 1:1 from `swarom_jewellary/`:

- Colour tokens — `cream/charcoal/silver/gold` palette
- Type stack — Cormorant Garamond + Inter, loaded the same way
- The grain texture, the shimmer underline, the float keyframes
- The waitlist form pattern (pill input + pill button, on-success message)
- The hairline + uppercase eyebrow vocabulary (`COMING SOON`, `BENGALURU · EST. 2026`)

Extended for the full surface (not in the live waitlist site):

- Product tile + product detail layouts
- Bag drawer
- Site nav with collection / story / care
- Editorial story block

## Caveats

- Product imagery is placeholder SVG (`assets/product-*.svg`). Real product photography would slot in cleanly into the same `.kit-tile-image` containers.
- No real backend wiring — adding to bag is in-memory; checkout is a button.
- No mobile-first pass — the responsive media query at the bottom of `kit.css` is a light cleanup, not a full mobile design.
