# catalogue-intake

Staging area for product photography. Nothing here is deployed — the images
end up on Cloudinary and the rows end up in Supabase.

Product photographs never belong in `public/`: that ships them inside the
git repo and inside every Vercel deploy.

## The pipeline

    manifest.json   one entry per piece — file, slug, name, copy, category
    upload.mjs      pushes each file to Cloudinary, writes image_url back
    import.mjs      creates/updates a DRAFT product per entry
    specs.json      the bench numbers. All null until you fill them in.
    activate.mjs    prices every piece and takes it live

Run from the repo root so the Cloudinary and Supabase keys are loaded:

    set -a; . ./.env.local; set +a
    cd catalogue-intake
    node upload.mjs        # idempotent: overwrite:true keeps the public id stable
    node import.mjs        # idempotent: upserts on slug
    node activate.mjs --dry
    node activate.mjs

Images are delivered through `src/lib/cloudinary-loader.ts`, which appends
`f_auto,q_auto,w_<width>,c_limit`. Vercel's image optimizer is bypassed
entirely — that was the 402 that took the storefront's images down.

## Why everything imports as a draft

Purity, net weight, stone identity and pearl type cannot be read off a
photograph. `import.mjs` writes `status: 'draft'` and `price: 0`, and
`metal` gets the schema's placeholder because the column is NOT NULL — it
is **not** a statement about the piece.

`activate.mjs` is the only thing that sets `status: 'active'`, and it
refuses any piece still missing a number in `specs.json`. Leave that
refusal in place. A gold piece with a guessed weight must not be buyable.

## What `specs.json` wants

    rate_per_gram   today's rate per purity; appended to metal_rates on activate
    defaults        metal, wastage_pct, making_charge_type/value, stone_charges
    pieces          per-slug overrides, plus net_weight and hallmark_huid

`gross_weight` is the stamped "Approx wt." read off the supplier's photo.
Verify it on your own scale. `net_weight` is metal only, excluding stones,
and is what the rate multiplies.

GST (3% metal / 5% making) and rounding live in `store_settings`, so they
change without a deploy. Confirm both with your accountant.
