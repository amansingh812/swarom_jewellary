// Publish the drafts as enquiry-only pieces.
//
//   node publish-enquiry.mjs --dry    lists what would change
//   node publish-enquiry.mjs          sets status=active, enquiry_only=true
//
// An enquiry-only piece is publicly visible but carries no price and cannot
// be added to a bag — the order action refuses it server-side. This is the
// honest way to show gold whose net weight and purity are not yet confirmed.
//
// Run supabase/003_enquiry_only.sql first.
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

// Fail loudly if the migration has not been applied.
const probe = await fetch(`${SB}/rest/v1/products?select=enquiry_only&limit=1`, { headers });
if (!probe.ok) {
  const body = await probe.text();
  if (body.includes("enquiry_only")) {
    console.error(
      "\nThe `enquiry_only` column does not exist yet.\n" +
        "Run supabase/003_enquiry_only.sql in the Supabase SQL editor, then try again.\n"
    );
    process.exit(1);
  }
  console.error(`\nCould not reach products: ${probe.status} ${body.slice(0, 200)}\n`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(new URL("./manifest.json", import.meta.url), "utf8"));
const slugs = manifest.items.map((i) => i.slug);

const inList = `(${slugs.map((s) => `"${s}"`).join(",")})`;
const current = await (
  await fetch(
    `${SB}/rest/v1/products?select=slug,name,status,enquiry_only,price&slug=in.${encodeURIComponent(inList)}`,
    { headers }
  )
).json();

const toChange = current.filter((p) => p.status !== "active" || !p.enquiry_only);
console.log(`\n${current.length} piece(s) in the manifest are in the database.`);
console.log(`${toChange.length} would change to active + enquiry-only:\n`);
for (const p of toChange) {
  console.log(`  ${p.slug.padEnd(28)} ${p.status} -> active   enquiry_only ${p.enquiry_only} -> true`);
}

const priced = current.filter((p) => p.price > 0);
if (priced.length) {
  console.log(`\nNote: ${priced.length} piece(s) carry a non-zero price. Going enquiry-only hides it.`);
}

if (!toChange.length) { console.log("\nNothing to do.\n"); process.exit(0); }
if (DRY) { console.log("\n--dry: nothing written.\n"); process.exit(0); }

const res = await fetch(`${SB}/rest/v1/products?slug=in.${encodeURIComponent(inList)}`, {
  method: "PATCH",
  headers: { ...headers, Prefer: "return=minimal" },
  body: JSON.stringify({ status: "active", enquiry_only: true }),
});
if (!res.ok) {
  console.error(`\nFAILED ${res.status} ${(await res.text()).slice(0, 300)}\n`);
  process.exit(1);
}
console.log(`\n${toChange.length} piece(s) are now live as enquiry-only.`);
console.log("They show 'Price on request' and an enquiry button. They cannot be bought.\n");
console.log("To price them properly later: fill specs.json, run activate.mjs,");
console.log("then clear enquiry_only on the pieces that now have a real price.\n");
