"use server";

import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";

/**
 * Upload an image to the `product-images` Supabase Storage bucket.
 * Returns the public URL on success.
 *
 * Called from admin product editor via FormData.
 */
export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const file = formData.get("file");
  if (!(file instanceof File))
    return { ok: false, message: "No file provided." };
  if (file.size > 8 * 1024 * 1024)
    return { ok: false, message: "File is larger than 8 MB." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "svg"].includes(ext) ? ext : "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${safeExt}`;

  const supabase = createServerSupabaseClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) return { ok: false, message: error.message };

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
