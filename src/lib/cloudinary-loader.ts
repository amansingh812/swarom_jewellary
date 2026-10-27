/**
 * next/image custom loader — Cloudinary.
 *
 * Registered in next.config.mjs as `images.loaderFile`. Because a custom
 * loader bypasses Vercel's image optimizer entirely, nothing here is metered
 * and /_next/image is never hit (that route is what was returning 402).
 *
 * This module is bundled for the browser, so it must not read server-only
 * env or import the Cloudinary SDK. It is pure string work: we store full
 * delivery URLs in the database, and this injects the transformation
 * segment Cloudinary expects.
 *
 *   https://res.cloudinary.com/<cloud>/image/upload/v173.../swarom/products/x.jpg
 *                                          ^ transformations go here
 *
 * Anything that is not a Cloudinary delivery URL — local /public files,
 * Unsplash stills — is returned untouched and served as-is.
 */

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

const MARKER = "/image/upload/";

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  if (!src.includes("res.cloudinary.com")) return src;

  const at = src.indexOf(MARKER);
  if (at === -1) return src;

  const head = src.slice(0, at + MARKER.length);
  const tail = src.slice(at + MARKER.length);

  // f_auto  → WebP/AVIF where the browser supports it
  // q_auto  → Cloudinary picks the quality, or we honour an explicit one
  // c_limit → never upscale past the original
  const transforms = [
    "f_auto",
    `q_${quality ?? "auto"}`,
    `w_${width}`,
    "c_limit",
  ].join(",");

  return `${head}${transforms}/${tail}`;
}
