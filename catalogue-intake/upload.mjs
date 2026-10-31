// Upload everything named in manifest.json to Cloudinary.
// Re-runnable: overwrite:true means the same piece keeps the same public id.
import { v2 as cloudinary } from "cloudinary";
import { readFileSync, writeFileSync } from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const manifestPath = new URL("./manifest.json", import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const put = (buf, id) =>
  new Promise((res, rej) =>
    cloudinary.uploader
      .upload_stream(
        { folder: "swarom/products", public_id: id, overwrite: true, resource_type: "image" },
        (e, r) => (e ? rej(e) : res(r))
      )
      .end(buf)
  );

for (const item of manifest.items) {
  const buf = readFileSync(new URL("./" + item.file, import.meta.url));
  const r = await put(buf, item.slug);
  item.image_url = r.secure_url;
  console.log(
    `  ${item.slug.padEnd(26)} ${r.width}x${r.height} ${r.format}  ${(r.bytes / 1024).toFixed(0)}KB`
  );
  console.log(`     ${r.secure_url}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("\nmanifest.json updated with image_url for each piece.");
