// Take the drafts live.
//
//   node activate.mjs --dry     prints the prices it WOULD set, writes nothing
//   node activate.mjs           publishes the rate, prices every piece, sets status=active
//
// It refuses to activate any piece whose bench numbers are missing from
// specs.json. That refusal is the point: a gold piece with a guessed weight
// or an unstated purity must not be buyable.
import { readFileSync } from "node:fs";

const DRY = process.argv.includes("--dry");

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB || !KEY) throw new Error("Supabase env missing — source .env.local first.");

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

const specs = JSON.parse(readFileSync(new URL("./specs.json", import.meta.url), "utf8"));
const D = specs.defaults ?? {};

// ── the same arithmetic as src/lib/pricing.ts ──────────────────────
function computeGoldPrice(i) {
  const netWeight = Math.max(0, i.netWeight || 0);
  const ratePerGram = Math.max(0, i.ratePerGram || 0);
  const wastagePct = Math.max(0, i.wastagePct ?? 0);
  const makingType = i.makingChargeType ?? "per_gram";
  const makingValue = Math.max(0, i.makingChargeValue ?? 0);
  const stones = Math.max(0, i.stoneCharges ?? 0);
  const gstJ = Math.max(0, i.gstPctJewellery ?? 3);
  const gstM = Math.max(0, i.gstPctMaking ?? 5);
  const roundTo = Math.max(1, i.roundTo ?? 1);

  const metalValue = netWeight * ratePerGram;
  const wastage = metalValue * (wastagePct / 100);
  let making = 0;
  if (makingType === "per_gram") making = netWeight * makingValue;
  else if (makingType === "percentage") making = (metalValue + wastage) * (makingValue / 100);
  else making = makingValue;

  const metalSide = metalValue + wastage + stones;
  const subtotal = metalSide + making;
  const tax = metalSide * (gstJ / 100) + making * (gstM / 100);
  return {
    metalValue: Math.round(metalValue),
    wastage: Math.round(wastage),
    making: Math.round(making),
    stones: Math.round(stones),
    tax: Math.round(tax),
    total: Math.round((subtotal + tax) / roundTo) * roundTo,
  };
}

const settings = Object.fromEntries(
  (await (await fetch(`${SB}/rest/v1/store_settings?select=key,value`, { headers })).json())
    .map((r) => [r.key, Number(r.value)])
);
const gstJ = settings.gst_pct_jewellery ?? 3;
const gstM = settings.gst_pct_making ?? 5;
const roundTo = settings.price_rounding ?? 10;

// ── validate before touching anything ──────────────────────────────
const problems = [];
const ready = [];

for (const [slug, p] of Object.entries(specs.pieces ?? {})) {
  const metal = p.metal ?? D.metal;
  const net = p.net_weight ?? null;
  const mcType = p.making_charge_type ?? D.making_charge_type ?? "per_gram";
  const mcValue = p.making_charge_value ?? D.making_charge_value ?? null;
  const wastage = p.wastage_pct ?? D.wastage_pct ?? null;
  const stones = p.stone_charges ?? D.stone_charges ?? 0;
  const rate = (specs.rate_per_gram ?? {})[metal] ?? null;

  const missing = [];
  if (!metal) missing.push("metal");
  if (net == null) missing.push("net_weight");
  if (mcValue == null) missing.push("making_charge_value");
  if (wastage == null) missing.push("wastage_pct");
  if (rate == null) missing.push(`rate_per_gram.${metal ?? "<metal>"}`);
  if (net != null && p.gross_weight != null && net > p.gross_weight)
    missing.push(`net_weight ${net}g exceeds gross ${p.gross_weight}g`);

  if (missing.length) { problems.push(`  ${slug.padEnd(28)} ${missing.join(", ")}`); continue; }

  const b = computeGoldPrice({
    netWeight: net, ratePerGram: rate, wastagePct: wastage,
    makingChargeType: mcType, makingChargeValue: mcValue, stoneCharges: stones,
    gstPctJewellery: gstJ, gstPctMaking: gstM, roundTo,
  });
  ready.push({ slug, metal, net, rate, wastage, mcType, mcValue, stones, b, p });
}

if (problems.length) {
  console.log(`\nNOT ready — ${problems.length} piece(s) missing bench numbers:\n`);
  console.log(problems.join("\n"));
}
if (!ready.length) { console.log("\nNothing to activate.\n"); process.exit(problems.length ? 1 : 0); }

console.log(`\n${ready.length} piece(s) priced:\n`);
console.log("  slug                          net   metal      wastage   making    stones      GST      TOTAL");
for (const r of ready) {
  console.log(
    `  ${r.slug.padEnd(28)} ${String(r.net).padStart(4)}g ` +
    `${String(r.b.metalValue).padStart(8)} ${String(r.b.wastage).padStart(8)} ` +
    `${String(r.b.making).padStart(8)} ${String(r.b.stones).padStart(8)} ` +
    `${String(r.b.tax).padStart(8)} ${String(r.b.total).padStart(10)}`
  );
}

if (DRY) { console.log("\n--dry: nothing written.\n"); process.exit(0); }

// ── publish the rate(s), append-only ───────────────────────────────
for (const [metal, rate] of Object.entries(specs.rate_per_gram ?? {})) {
  if (rate == null) continue;
  const res = await fetch(`${SB}/rest/v1/metal_rates`, {
    method: "POST", headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({ metal, rate_per_gram: rate, effective_from: new Date().toISOString() }),
  });
  console.log(res.ok ? `\nrate published: ${metal} = Rs${rate}/g`
                     : `\nrate FAILED for ${metal}: ${res.status} ${(await res.text()).slice(0, 200)}`);
}

// ── write each piece ───────────────────────────────────────────────
let ok = 0;
for (const r of ready) {
  const patch = {
    metal: r.metal,
    pricing_mode: "weight_based",
    net_weight: r.net,
    wastage_pct: r.wastage,
    making_charge_type: r.mcType,
    making_charge_value: r.mcValue,
    stone_charges: r.stones,
    price: r.b.total,
    status: "active",
  };
  if (r.p.stone_details != null) patch.stone_details = r.p.stone_details;
  if (r.p.hallmark_huid != null) patch.hallmark_huid = r.p.hallmark_huid;

  const res = await fetch(`${SB}/rest/v1/products?slug=eq.${encodeURIComponent(r.slug)}`, {
    method: "PATCH", headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  if (res.ok) { ok++; console.log(`  ${r.slug.padEnd(28)} active at Rs${r.b.total}`); }
  else console.log(`  ${r.slug.padEnd(28)} FAILED ${res.status} ${(await res.text()).slice(0, 200)}`);
}
console.log(`\n${ok}/${ready.length} live.` + (problems.length ? ` ${problems.length} still draft.` : ""));
