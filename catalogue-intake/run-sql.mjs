// Run a .sql file against the project using the Supabase Management API.
//   SUPABASE_ACCESS_TOKEN=sbp_xxx node catalogue-intake/run-sql.mjs supabase/002b_gold_line_tables.sql
//
// Needs a Personal Access Token (supabase.com/dashboard/account/tokens).
// The service-role key cannot run DDL — it only speaks to PostgREST, which
// does CRUD, not schema changes.
import { readFileSync } from "node:fs";

const file = process.argv[2];
const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .replace("https://", "")
  .split(".")[0];

if (!file) throw new Error("usage: node run-sql.mjs <file.sql>");
if (!token) throw new Error("SUPABASE_ACCESS_TOKEN is not set");
if (!ref) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");

const query = readFileSync(file, "utf8");
console.log(`  project ${ref}  ·  ${file}  ·  ${query.length} bytes`);

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});

const body = await res.text();
if (!res.ok) {
  console.error(`  FAILED ${res.status}: ${body.slice(0, 600)}`);
  process.exit(1);
}
console.log(`  OK ${res.status}  ${body.slice(0, 300)}`);
