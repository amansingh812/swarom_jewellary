import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatINR } from "@/lib/money";
import { WishlistButton } from "./WishlistButton";

interface ProductTileProps {
  product: Product;
  inWishlist?: boolean;
}

export function ProductTile({ product, inWishlist = false }: ProductTileProps) {
  return (
    <article className="group relative flex flex-col">
      <WishlistButton
        productId={product.id}
        initialInWishlist={inWishlist}
        redirectAfter={`/product/${product.slug}`}
      />
      <Link
        href={`/product/${product.slug}`}
        className="flex flex-col cursor-pointer"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-200 mb-5">
          {product.image_main && (
            <Image
              src={product.image_main}
              alt={`${product.name} ${product.modifier ?? ""}`}
              width={400}
              height={500}
              className="h-full w-full object-cover swr-zoom"
            />
          )}
          <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex justify-center bg-gradient-to-t from-[var(--silver-light)]/80 to-transparent">
            <span className="swr-eyebrow swr-underline-anim">View Details</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h3 className="font-serif text-[20px] font-medium leading-[1.4] tracking-[0.01em] text-charcoal">
            {product.name}{" "}
            {product.modifier && (
              <i className="font-normal text-charcoal-700">{product.modifier}</i>
            )}
          </h3>
          {product.meta && <span className="swr-meta">{product.meta}</span>}
          <span className="swr-price">{formatINR(product.price)}</span>
        </div>
      </Link>
    </article>
  );
}
