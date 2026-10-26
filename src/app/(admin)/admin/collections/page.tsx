import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { CollectionsClient, CollectionRowView } from "./CollectionsClient";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata = { title: "Collections · Swarom" };

export default async function AdminCollectionsPage() {
  let rows: CollectionRowView[] = [];

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();

    const [{ data: collections }, { data: products }] = await Promise.all([
      supabase
        .from("collections")
        .select("id, slug, name, description, position")
        .order("position", { ascending: true }),
      supabase.from("products").select("collection_id"),
    ]);

    const counts = new Map<string, number>();
    for (const p of (products ?? []) as { collection_id: string | null }[]) {
      if (!p.collection_id) continue;
      counts.set(p.collection_id, (counts.get(p.collection_id) ?? 0) + 1);
    }

    rows = ((collections ?? []) as Omit<CollectionRowView, "productCount">[]).map((c) => ({
      ...c,
      productCount: counts.get(c.id) ?? 0,
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Eyebrow>Collections</Eyebrow>
        <h1 className="swr-h1 mt-2">How the catalogue is grouped</h1>
        <p className="swr-lede mt-3 max-w-[520px]">
          Collections are what the shop filters by and what the Collections page
          lists. Deleting one leaves its pieces in place — they just become
          uncategorised.
        </p>
      </header>

      <CollectionsClient initial={rows} />
    </div>
  );
}
