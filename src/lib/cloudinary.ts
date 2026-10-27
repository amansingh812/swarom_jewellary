import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

/**
 * Server-side Cloudinary. Product photographs live here rather than in
 * Supabase storage or the git repo: Cloudinary resizes and reformats on
 * delivery, so one upload serves every breakpoint.
 *
 * Never import this from a client component — it carries the API secret.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/** Swarom's own namespace inside a Cloudinary account that holds other work. */
export const PRODUCT_FOLDER = "swarom/products";
export const BRAND_FOLDER = "swarom/brand";

if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

export interface UploadedImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

/** Upload raw bytes. Returns the plain delivery URL — the loader adds transforms. */
export function uploadImage(
  bytes: Buffer,
  opts: { folder?: string; filename?: string } = {}
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: opts.folder ?? PRODUCT_FOLDER,
        resource_type: "image",
        use_filename: Boolean(opts.filename),
        filename_override: opts.filename,
        unique_filename: true,
        overwrite: false,
      },
      (error, result?: UploadApiResponse) => {
        if (error) return reject(new Error(error.message));
        if (!result) return reject(new Error("Cloudinary returned no result."));
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          format: result.format,
        });
      }
    );
    stream.end(bytes);
  });
}

export async function destroyImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

/**
 * Recover the public id from a delivery URL, so a photo removed in the admin
 * can also be removed from Cloudinary rather than left orphaned.
 *
 *   .../image/upload/v1730000000/swarom/products/abc.jpg  →  swarom/products/abc
 */
export function publicIdFromUrl(url: string): string | null {
  if (!url.includes("res.cloudinary.com")) return null;
  const at = url.indexOf("/image/upload/");
  if (at === -1) return null;

  const parts = url
    .slice(at + "/image/upload/".length)
    .split("?")[0]
    .split("/");

  // Drop the version segment and any transformation segments.
  while (parts.length > 1 && /^(v\d+|[a-z]{1,3}_[^/]*)$/.test(parts[0])) {
    parts.shift();
  }

  const last = parts.pop();
  if (!last) return null;
  return [...parts, last.replace(/\.[a-z0-9]+$/i, "")].join("/");
}

export { cloudinary };
