import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components.
 *
 * Reads the anon key — safe to expose to the browser; RLS enforces all access.
 *
 * If env vars aren't set (i.e. the dev hasn't configured Supabase yet), we
 * still return a real client pointed at a placeholder URL so the build
 * doesn't crash. Calls fail at runtime — the UI handles that.
 *
 * NOTE: We deliberately don't pass `<Database>` as a generic. The Row types
 * are used via `.returns<T>()` and `.single<T>()` for read safety; inserts
 * are checked at the action layer. This trade-off keeps the typed client
 * happy without circular inference issues.
 */
export function createBrowserSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createBrowserClient(url, key);
}
