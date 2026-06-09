"use server";

import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export interface NewsletterResult {
  ok: boolean;
  message: string;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Subscribe an email to the newsletter list.
 * Idempotent — duplicate emails are silently treated as success.
 */
export async function subscribeNewsletter(
  email: string,
  source: string = "site"
): Promise<NewsletterResult> {
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RX.test(trimmed)) {
    return { ok: false, message: "Please enter a valid email." };
  }

  if (!isSupabaseConfigured()) {
    // Dev fallback — log and pretend it succeeded.
    console.log(`[newsletter] (dev) would subscribe ${trimmed} from ${source}`);
    return {
      ok: true,
      message: "You're on the list. We'll be in touch when we open doors.",
    };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("newsletter")
    .insert({ email: trimmed, source });

  // 23505 = unique violation — already on the list. That's a success too.
  if (error && error.code !== "23505") {
    console.error("[newsletter]", error);
    return { ok: false, message: "Something went wrong. Try again?" };
  }

  return {
    ok: true,
    message: "You're on the list. We'll be in touch.",
  };
}
