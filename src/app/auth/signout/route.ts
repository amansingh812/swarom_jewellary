import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /auth/signout
 * Clears the Supabase session cookies server-side (the only reliable way
 * with @supabase/ssr), then redirects to the home page.
 */
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 302 });
}
