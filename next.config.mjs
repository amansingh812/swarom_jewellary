/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Images are delivered and transformed by Cloudinary, not by Vercel.
    // A custom loader means /_next/image is never called, so the metered
    // optimizer (which was returning 402 and breaking every product card)
    // is out of the path entirely.
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
