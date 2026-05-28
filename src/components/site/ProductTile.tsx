import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatINR } from "@/lib/money";

interface ProductTileProps {
  product: Product;
}

export function ProductTile({ product }: ProductTileProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      <div className="aspect-[4/5] overflow-hidden rounded-md bg-cream-200">
        {product.image_main && (
          <Image
            src={product.image_main}
            alt={`${product.name} ${product.modifier ?? ""}`}
            width={400}
            height={500}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="swr-h4">
          {product.name}{" "}
          {product.modifier && (
            <i className="font-normal text-charcoal/65">{product.modifier}</i>
          )}
        </h3>
        {product.meta && (
          <span className="swr-meta">{product.meta}</span>
        )}
        <span className="swr-price mt-1">{formatINR(product.price)}</span>
      </div>
    </Link>
  );
}
