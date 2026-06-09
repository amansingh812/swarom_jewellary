"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { toggleWishlist } from "@/app/actions/wishlist";

interface WishlistButtonProps {
  productId: string;
  initialInWishlist?: boolean;
  variant?: "tile" | "pdp";
  redirectAfter?: string;
}

/**
 * Heart toggle for product tiles and PDP.
 * Optimistically updates the icon state; the server action persists.
 */
export function WishlistButton({
  productId,
  initialInWishlist = false,
  variant = "tile",
  redirectAfter,
}: WishlistButtonProps) {
  const [active, setActive] = useState(initialInWishlist);
  const [pending, startTransition] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      // optimistic
      setActive((v) => !v);
      try {
        const res = await toggleWishlist(productId, redirectAfter);
        if (res.ok) {
          setActive(res.inWishlist);
        } else {
          setActive((v) => !v); // revert
        }
      } catch {
        setActive((v) => !v);
      }
    });
  }

  const isPdp = variant === "pdp";
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={onClick}
      disabled={pending}
      className={
        isPdp
          ? `h-11 w-11 rounded-full border border-[var(--hairline)] flex items-center justify-center transition-colors ${
              active ? "bg-cream-200 text-gold border-gold" : "bg-cream-50 text-charcoal/60 hover:text-charcoal"
            }`
          : `absolute right-2 top-2 h-9 w-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              active
                ? "bg-cream text-gold shadow-soft scale-100"
                : "bg-cream/80 text-charcoal/65 hover:bg-cream hover:text-charcoal opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 focus-visible:opacity-100"
            }`
      }
    >
      <Icon name="heart" size={isPdp ? 16 : 14} />
    </button>
  );
}
