import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-anon-key";

/**
 * Supabase client for Server Components and Route Handlers.
 * Reads/writes the session cookie automatically.
 *
 * If env vars aren't set we still return a real client (pointed at a
 * placeholder) so the build and dev server don't crash. Calls will fail
 * gracefully — guard data fetches with `isSupabaseConfigured()` below.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Set from a Server Component — middleware refreshes it.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // ignored
          }
        },
      },
    }
  );
}

/**
 * Admin Supabase client for server-only operations that need to bypass RLS
 * (e.g. webhook handlers writing to orders). Uses the service-role key.
 * NEVER use this in code that ships to the browser.
 */
export function createAdminSupabaseClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || PLACEHOLDER_KEY,
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {},
      },
    }
  );
}

/** True if real Supabase env vars are set (not placeholders). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT")
  );
}
