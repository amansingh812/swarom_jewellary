// Create (or update) a draft product per manifest entry.
//
// Run AFTER supabase/002_gold_line.sql — it needs the `necklace` category,
// the metal/pricing columns and supplier_code. Pieces are created as DRAFT
// on purpose: nothing with a null purity or unidentified stone should be
// buyable. Fill the nulls in manifest.json (or in the admin), then publish.
import { readFileSync } from "node:fs";

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB || !KEY) throw new Error("Supabase env missing — source .env.local first.");

const manifest = JSON.parse(
  readFileSync(new URL("./manifest.json", import.meta.url), "utf8")
);

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

for (const it of manifest.items) {
  if (!it.image_url) {
    console.log(`  ${it.slug}: no image_url — run upload.mjs first`);
    continue;
  }

  const row = {
    slug: it.slug,
    name: it.name,
    modifier: it.modifier,
    description: it.description,
    category: it.category,
    meta: it.meta,
    image_main: it.image_url,
    images: [it.image_url],
    status: "draft",
    price: 0,
    // A piece only becomes weight_based once it HAS a weight — the
    // products_weight_required constraint rejects it otherwise, and quite
    // right too. Fill net_weight in the manifest and re-run; it flips itself.
    pricing_mode: it.net_weight != null ? "weight_based" : "fixed",
    metal: it.metal ?? "gold_22k",
    gross_weight: it.gross_weight ?? null,
    net_weight: it.net_weight ?? null,
    wastage_pct: it.wastage_pct ?? 0,
    making_charge_value: it.making_charge_value ?? 0,
    stone_charges: it.stone_charges ?? 0,
    supplier_code: it.supplier_code ?? null,
    hallmark_huid: it.hallmark_huid ?? null,
    options: {},
  };

  const res = await fetch(`${SB}/rest/v1/products?on_conflict=slug`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row),
  });
  const body = await res.text();
  if (!res.ok) {
    console.log(`  ${it.slug}: FAILED ${res.status} ${body.slice(0, 200)}`);
    continue;
  }
  const missing = ["metal", "net_weight", "stone_details", "hallmark_huid"].filter(
    (k) => it[k] == null
  );
  console.log(
    `  ${it.slug.padEnd(28)} draft created` +
      (missing.length ? `  — still needs: ${missing.join(", ")}` : "")
  );
}
console.log("\nAll pieces are DRAFT. Set status to active once the specs are filled.");
