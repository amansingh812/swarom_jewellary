/**
 * next/image custom loader.
 *
 * Registered in next.config.mjs as `images.loaderFile`. A custom loader
 * bypasses Vercel's image optimizer entirely, so /_next/image is never hit
 * — that route is what was returning 402 and breaking every product card.
 *
 * This module is bundled for the browser, so it must not read server-only
 * env or import the Cloudinary SDK. It is pure string work.
 *
 * Next.js requires a custom loader to USE the `width` it is given. If it
 * doesn't, Next logs "has a loader property that does not implement width"
 * and the image is served at one size to every device. So every host we
 * know how to resize is handled explicitly below.
 */

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

const CLOUDINARY_MARKER = "/image/upload/";

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  // ── Cloudinary: our own product and brand photography ──────────
  if (src.includes("res.cloudinary.com")) {
    const at = src.indexOf(CLOUDINARY_MARKER);
    if (at !== -1) {
      const head = src.slice(0, at + CLOUDINARY_MARKER.length);
      const tail = src.slice(at + CLOUDINARY_MARKER.length);
      // f_auto  → WebP/AVIF where the browser supports it
      // q_auto  → Cloudinary picks quality, unless we were given one
      // c_limit → never upscale past the original
      const t = ["f_auto", `q_${quality ?? "auto"}`, `w_${width}`, "c_limit"];
      return `${head}${t.join(",")}/${tail}`;
    }
    return src;
  }

  // ── Unsplash placeholders: resize via their own query params ───
  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 80));
    url.searchParams.set("auto", "format");
    return url.toString();
  }

  // ── Anything else (local /public files) ────────────────────────
  // Nothing can resize these at request time. Mark such images
  // `unoptimized` on the <Image> itself to keep Next quiet.
  return src;
}
