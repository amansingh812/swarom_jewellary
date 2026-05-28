---
name: swarom-design
description: Use this skill to generate well-branded interfaces and assets for Swarom — a personalized 925 sterling silver jewellery brand handcrafted in Bengaluru ("Your story, told in silver."). Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping marketing pages, product catalogue, lookbooks, slides, and throwaway prototypes.
user-invocable: true
---

Read the `README.md` file within this skill first, then explore the other available files — especially `colors_and_type.css` (every token + semantic type class lives here) and `ui_kits/website/` (pixel-faithful React components for the marketing + commerce surface).

If creating **visual artifacts** (slides, mocks, throwaway prototypes), copy assets out of `assets/` and create static HTML files for the user to view. Use the icon sprite at `assets/icons.svg` via `<use href="…#swr-bag"/>` — never substitute Lucide / Heroicons / Material. Use the SVG product stills in `assets/` as placeholders if real photography is unavailable.

If working on **production code**, copy the assets you need and read the rules in README.md to design with this brand. Match the voice exactly: short sentences, sentence-case body, UPPERCASE eyebrows at .2em tracking, no emoji, no exclamation marks, no "elevate"/"curate"/"luxury".

If the user invokes this skill without other guidance, ask them what they want to build, ask a few questions (audience, surface, length, whether they want variations), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

**Non-negotiables**

- Page background is always `--cream` with the grain overlay; never a coloured gradient.
- Gold (`--gold`, `#B8956A`) only appears at hairline weight or as a tiny mark — never a fill.
- Buttons and inputs default to pills (`--radius-pill`).
- Display type is Cormorant Garamond (italic for taglines). UI is Inter, set loose.
- Hairline icons only (1.4 stroke, round caps, currentColor). No emoji ever.
- Voice is warm, intimate, hand-written. Three-to-eight-word sentences.
