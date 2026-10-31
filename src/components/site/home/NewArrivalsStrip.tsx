import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatINR } from "@/lib/money";
import { ButtonLink } from "@/components/ui/Button";
import { WishlistButton } from "@/components/site/WishlistButton";
import { JaaliPanel } from "@/components/ui/Ornament";

interface Props {
  products: Product[];
  wishlist: Set<string>;
}

/**
 * Dark editorial band — "fresh from the bench" pieces presented like a
 * curated collection on charcoal velvet, per the landing design.
 */
export function NewArrivalsStrip({ products, wishlist }: Props) {
  const show = products.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-charcoal py-16 md:py-28">
      <JaaliPanel className="-right-16 -top-16 h-[420px] w-[420px]" opacity={0.2} />
      <div className="relative mx-auto max-w-marketing px-6 md:px-20">
        <div className="flex flex-col items-center gap-4 mb-10 md:mb-14 text-center">
          <span className="swr-eyebrow !text-gold-soft">New Arrivals</span>
          <h2 className="font-serif text-[28px] md:text-[32px] leading-[1.3] tracking-[0.02em] text-cream">
            Fresh from <i>the bench.</i>
          </h2>
          <div className="h-px w-24 bg-gold-soft/60" aria-hidden />
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {show.map((p, i) => (
            <article key={p.id} className="group relative flex flex-col">
              {i === 0 && (
                <span className="absolute top-4 left-4 z-[2] bg-cream/90 text-gold px-3 py-1.5 font-sans text-[10px] font-semibold tracking-widest uppercase">
                  New
                </span>
              )}
              <WishlistButton productId={p.id} initialInWishlist={wishlist.has(p.id)} />
              <Link href={`/product/${p.slug}`} className="flex flex-col">
                <div className="aspect-[4/5] overflow-hidden bg-charcoal-800 mb-6">
                  {p.image_main && (
                    <Image
                      src={p.image_main}
                      alt={`${p.name} ${p.modifier ?? ""}`}
                      width={500}
                      height={625}
                      className="h-full w-full object-cover swr-zoom"
                    />
                  )}
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <h3 className="font-serif text-[20px] font-medium tracking-[0.01em] text-cream">
                    {p.name}{" "}
                    {p.modifier && (
                      <i className="font-normal text-cream/70">{p.modifier}</i>
                    )}
                  </h3>
                  <p className="font-sans text-[15px] tracking-[0.02em] text-cream/70 m-0">
                    {formatINR(p.price)}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <ButtonLink
            href="/shop"
            variant="ghost"
            size="md"
            className="!border-cream/40 !text-cream hover:!border-gold-soft hover:!text-gold-soft"
          >
            View all pieces
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
