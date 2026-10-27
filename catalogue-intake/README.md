# catalogue-intake

Drop raw product photographs here (straight off the camera or the phone).

Nothing in this folder is committed or deployed — it is a staging area. The
import pipeline reads from here, then:

  1. crops to a 4:5 frame
  2. normalises the backdrop
  3. writes WebP at 1400px plus a 400px thumbnail
  4. uploads to the Supabase `product-images` bucket
  5. creates a draft product per image

Once a piece is live its images are served from Supabase storage, which is
already CDN-backed. Product photographs never belong in `public/` — that
ships them in the git repo and in every Vercel deploy.
