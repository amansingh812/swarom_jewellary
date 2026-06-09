import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatINR } from "@/lib/money";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { WishlistButton } from "@/components/site/WishlistButton";

interface Props {
  products: Product[];
  wishlist: Set<string>;
}

/**
 * Strip on a deeper-cream panel with white-card products.
 * Equivalent to ella's "New Arrivals" row.
 */
export function NewArrivalsStrip({ products, wishlist }: Props) {
  const show = products.slice(0, 3);

  return (
    <section className="bg-cream-200 py-14 md:py-20">
      <div className="mx-auto max-w-marketing px-5 md:px-10">
        <div className="flex flex-col items-center gap-3 mb-8 md:mb-12">
          <Eyebrow withRule>New Arrivals</Eyebrow>
          <h2 className="swr-h2 text-center italic">Fresh from the bench.</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {show.map((p, i) => (
            <article
              key={p.id}
              className="group relative bg-cream-50 rounded-xl shadow-soft overflow-hidden flex flex-col"
            >
              {i === 0 && (
                <span className="absolute top-3 left-3 z-[2] rounded-pill bg-gold text-cream px-2.5 py-1 font-sans text-[9px] tracking-widest uppercase">
                  New
                </span>
              )}
              <WishlistButton productId={p.id} initialInWishlist={wishlist.has(p.id)} />
              <Link href={`/product/${p.slug}`} className="flex flex-col">
                <div className="aspect-[5/4] overflow-hidden bg-cream-200">
                  {p.image_main && (
                    <Image
                      src={p.image_main}
                      alt={`${p.name} ${p.modifier ?? ""}`}
                      width={500}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <h3 className="font-serif font-medium text-[15px] text-charcoal truncate">
                      {p.name}{" "}
                      {p.modifier && (
                        <i className="font-normal text-charcoal/65">{p.modifier}</i>
                      )}
                    </h3>
                    <p className="swr-price text-[14px] mt-1">{formatINR(p.price)}</p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/shop" variant="ghost" size="md">
            View all
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
