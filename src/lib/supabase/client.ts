import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Supabase client for use in Client Components.
 *
 * Reads the anon key — safe to expose to the browser; RLS enforces all access.
 *
 * If env vars aren't set (i.e. the dev hasn't configured Supabase yet), we
 * return a real client pointed at a placeholder URL. All auth calls will fail
 * gracefully — the UI handles that — but the app still builds and runs.
 */
export function createBrowserSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createBrowserClient<Database>(url, key);
}
