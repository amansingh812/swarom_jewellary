"use server";

import { requireAdmin } from "@/lib/auth/server";
import {
  isCloudinaryConfigured,
  uploadImage,
  destroyImage,
  publicIdFromUrl,
  PRODUCT_FOLDER,
} from "@/lib/cloudinary";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

export interface UploadResult {
  ok: boolean;
  url?: string;
  message?: string;
}

/**
 * Upload one product photograph to Cloudinary and return its delivery URL.
 *
 * The URL is stored plain, with no transformation segment — the next/image
 * loader adds `f_auto,q_auto,w_<width>` per breakpoint at render time, so a
 * single upload serves every size.
 */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  if (!isCloudinaryConfigured())
    return { ok: false, message: "Cloudinary is not configured." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, message: "No file provided." };

  if (file.size > MAX_BYTES)
    return { ok: false, message: `${file.name} is larger than 10 MB.` };

  if (file.type && !ALLOWED_TYPES.includes(file.type))
    return { ok: false, message: `${file.type} is not an image we accept.` };

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(bytes, {
      folder: PRODUCT_FOLDER,
      filename: file.name.replace(/\.[^.]+$/, ""),
    });
    return { ok: true, url: result.url };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Upload failed.",
    };
  }
}

/**
 * Remove an image from Cloudinary so dropping a photo in the admin does not
 * leave it orphaned. Local `/products/…` stills are not ours to delete and
 * are reported as a no-op success.
 */
export async function deleteProductImage(url: string): Promise<UploadResult> {
  await requireAdmin();
  if (!isCloudinaryConfigured())
    return { ok: false, message: "Cloudinary is not configured." };

  const publicId = publicIdFromUrl(url);
  if (!publicId) return { ok: true };

  try {
    await destroyImage(publicId);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not delete.",
    };
  }
}

/** Used when a product is deleted outright. */
export async function deleteProductImages(urls: string[]): Promise<UploadResult> {
  await requireAdmin();
  if (!isCloudinaryConfigured())
    return { ok: false, message: "Cloudinary is not configured." };

  const ids = urls
    .map(publicIdFromUrl)
    .filter((id): id is string => Boolean(id));
  if (!ids.length) return { ok: true };

  try {
    await Promise.all(ids.map((id) => destroyImage(id)));
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not delete.",
    };
  }
}
