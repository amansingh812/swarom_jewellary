"use server";

import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";

const BUCKET = "product-images";
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["jpg", "jpeg", "png", "webp", "svg"];

export interface UploadResult {
  ok: boolean;
  url?: string;
  message?: string;
}

/**
 * Upload one image to the `product-images` bucket and return its public URL.
 * Called from the admin product editor with FormData.
 */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, message: "No file provided." };
  if (file.size > MAX_BYTES)
    return { ok: false, message: `${file.name} is larger than 8 MB.` };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ALLOWED.includes(ext) ? ext : "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${safeExt}`;

  const supabase = createServerSupabaseClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) return { ok: false, message: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

/** The object path inside the bucket, or null if this isn't one of our uploads. */
function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const path = url.slice(i + marker.length).split("?")[0];
  return path || null;
}

/**
 * Remove an uploaded image from storage so dropping it from a product does
 * not leave the object orphaned in the bucket.
 *
 * Local seed paths such as `/products/real-ring.png` are not ours to delete —
 * those are skipped and reported as a no-op success.
 */
export async function deleteProductImage(url: string): Promise<UploadResult> {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const path = storagePathFromUrl(url);
  if (!path) return { ok: true };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Remove several at once — used when a product is deleted outright. */
export async function deleteProductImages(urls: string[]): Promise<UploadResult> {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const paths = urls
    .map(storagePathFromUrl)
    .filter((p): p is string => Boolean(p));
  if (!paths.length) return { ok: true };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
