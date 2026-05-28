import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  // TODO: wire to Supabase `wishlist` table once user accounts are live.
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
