"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth/server";

interface ToggleResult {
  inWishlist: boolean;
  ok: boolean;
  message?: string;
}

/**
 * Toggle a product in/out of the current user's wishlist.
 * If not signed in, redirects to /auth/login?next=… so they can come back.
 */
export async function toggleWishlist(
  productId: string,
  redirectAfter?: string
): Promise<ToggleResult> {
  const user = await getServerUser();
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(redirectAfter ?? "/shop")}`);
  }
  if (!isSupabaseConfigured()) {
    return { ok: false, inWishlist: false, message: "Database not connected." };
  }
  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", existing.id);
    if (error) return { ok: false, inWishlist: true, message: error.message };
    revalidatePath("/account/wishlist");
    return { ok: true, inWishlist: false };
  } else {
    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, product_id: productId });
    if (error) return { ok: false, inWishlist: false, message: error.message };
    revalidatePath("/account/wishlist");
    return { ok: true, inWishlist: true };
  }
}

/**
 * Return the set of product IDs in the current user's wishlist.
 * Empty set if not signed in.
 */
export async function getWishlistProductIds(): Promise<Set<string>> {
  const user = await getServerUser();
  if (!user || !isSupabaseConfigured()) return new Set();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id);
  return new Set((data ?? []).map((r) => r.product_id as string));
}
