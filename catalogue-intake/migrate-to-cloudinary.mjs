import { v2 as cloudinary } from "cloudinary";
import { readFileSync } from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const JOBS = [
  { file: "public/products/real-pendant.png",  folder: "swarom/products", id: "real-pendant",  category: "pendant" },
  { file: "public/products/real-ring.png",     folder: "swarom/products", id: "real-ring",     category: "ring" },
  { file: "public/products/real-bracelet.png", folder: "swarom/products", id: "real-bracelet", category: "bracelet" },
  { file: "public/products/real-anklet.png",   folder: "swarom/products", id: "real-anklet",   category: "anklet" },
  { file: "public/products/hero-model.png",    folder: "swarom/brand",    id: "hero-model",    category: null },
];

function upload(buf, folder, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, public_id: publicId, overwrite: true, resource_type: "image" },
        (err, res) => (err ? reject(err) : resolve(res))
      )
      .end(buf);
  });
}

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function patchProducts(category, url) {
  const res = await fetch(`${SB}/rest/v1/products?category=eq.${category}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ image_main: url, images: [url] }),
  });
  return res.status;
}

const results = {};
for (const job of JOBS) {
  const buf = readFileSync(job.file);
  const res = await upload(buf, job.folder, job.id);
  results[job.id] = res.secure_url;
  const saved = ((buf.length - res.bytes) / buf.length) * 100;
  console.log(
    `  ${job.id.padEnd(14)} ${(buf.length / 1048576).toFixed(2)}MB -> ` +
      `${(res.bytes / 1048576).toFixed(2)}MB  ${res.width}x${res.height} ${res.format}` +
      (saved > 0 ? `  (-${saved.toFixed(0)}%)` : "")
  );
  if (job.category) {
    const status = await patchProducts(job.category, res.secure_url);
    console.log(`    -> products.category=${job.category} patched [${status}]`);
  }
}

// "for-two" pieces share the pendant still.
const forTwo = await patchProducts("for-two", results["real-pendant"]);
console.log(`    -> products.category=for-two patched [${forTwo}]`);

console.log("\nURLS:");
for (const [k, v] of Object.entries(results)) console.log(`  ${k} = ${v}`);
