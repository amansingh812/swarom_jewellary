import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { ProductTile } from "@/components/site/ProductTile";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth/server";
import type { Product } from "@/lib/supabase/types";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const user = await getServerUser();
  let products: Product[] = [];

  if (user && isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("wishlist")
      .select("product:products(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<{ product: Product }[]>();
    products = (data ?? []).map((r) => r.product).filter(Boolean);
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <Eyebrow>Wishlist</Eyebrow>
        <p className="font-serif italic text-[20px] text-charcoal/70">
          Quiet for now.
        </p>
        <p className="swr-lede max-w-[420px]">
          Tap the heart on any piece to keep it here for later. You&apos;ll be
          the first to know if it changes.
        </p>
        <Link
          href="/shop"
          className="swr-meta text-charcoal border-b border-[var(--hairline)] inline-flex items-center gap-2 self-start mt-2 py-2 hover:border-charcoal"
        >
          Browse pieces <Icon name="arrow-right" size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Eyebrow>Wishlist</Eyebrow>
      <p className="swr-lede max-w-[420px]">
        {products.length} {products.length === 1 ? "piece" : "pieces"} you&apos;ve
        saved.
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6">
        {products.map((p) => (
          <ProductTile key={p.id} product={p} inWishlist />
        ))}
      </div>
    </div>
  );
}
