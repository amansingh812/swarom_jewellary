import { redirect } from "next/navigation";
import { cache } from "react";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

/**
 * Server-side auth helpers. Use these in Server Components and Server Actions.
 * All read functions are React-cached per request to avoid duplicate DB calls.
 */

/**
 * Returns the currently authenticated Supabase user, or null.
 * Cached per request.
 */
export const getServerUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Returns the profile row for the currently authenticated user, or null.
 * Cached per request.
 */
export const getProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();
  return data ?? null;
});

/**
 * Server guard — redirects to /auth/login if not signed in.
 * Use at the top of any Server Component that requires auth.
 */
export async function requireUser(redirectTo?: string) {
  const user = await getServerUser();
  if (!user) {
    const next = redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : "";
    redirect(`/auth/login${next}`);
  }
  return user;
}

/**
 * Server guard — redirects to /auth/login if not signed in,
 * or to / if signed in but not admin.
 */
export async function requireAdmin() {
  const user = await getServerUser();
  if (!user) redirect("/auth/login?next=/admin");
  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/");
  return { user, profile };
}
