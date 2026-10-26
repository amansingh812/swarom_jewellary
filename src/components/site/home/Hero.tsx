import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ArchFrame, JaaliPanel, KolamRule } from "@/components/ui/Ornament";
import { PHOTOS } from "@/lib/photos";

/**
 * Hero — editorial split. Left: eyebrow, display headline, tagline, CTAs and
 * the three proof points. Right: the model portrait inside the pointed arch,
 * with a jaali lattice drifting behind it.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <JaaliPanel className="-right-16 -top-12 h-[520px] w-[520px]" opacity={0.16} />

      <div className="relative mx-auto flex max-w-marketing flex-wrap items-center gap-10 px-6 md:gap-16 md:px-10 lg:px-20">
        {/* text */}
        <div className="min-w-0 flex-[999_1_420px] py-14 md:py-24">
          <div className="mb-6 flex items-center gap-3.5">
            <KolamRule />
            <p className="swr-eyebrow">Personalised 925 silver</p>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.1] tracking-[0.01em] text-charcoal md:text-[58px] lg:text-[64px]">
            A name, cast
            <br />
            in sterling silver.
          </h1>

          <p className="mt-5 font-serif text-[20px] italic leading-[1.5] text-charcoal-700 md:text-[24px]">
            Your story, told in silver.
          </p>

          <p className="swr-lede mt-6 max-w-[430px]">
            Handcrafted in Bengaluru, one piece at a time. Engrave a name, a
            date, a word in your own hand. Made to order. Made to last.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/shop" variant="primary" size="lg">
              Shop the collection
            </ButtonLink>
            <ButtonLink href="/collections" variant="secondary" size="lg">
              The collections
            </ButtonLink>
          </div>

          <dl className="mt-11 flex flex-wrap items-center gap-7 border-t border-silver/40 pt-7">
            <div>
              <dt className="sr-only">Silver purity</dt>
              <dd className="m-0">
                <span className="block font-serif text-[24px] text-charcoal">925</span>
                <span className="swr-meta">Hallmarked</span>
              </dd>
            </div>
            <span aria-hidden className="h-8 w-px bg-silver/50" />
            <div>
              <dt className="sr-only">Delivery</dt>
              <dd className="m-0">
                <span className="block font-serif text-[24px] text-charcoal">10 days</span>
                <span className="swr-meta">To your door</span>
              </dd>
            </div>
            <span aria-hidden className="h-8 w-px bg-silver/50" />
            <div>
              <dt className="sr-only">Aftercare</dt>
              <dd className="m-0">
                <span className="block font-serif text-[24px] text-charcoal">Lifetime</span>
                <span className="swr-meta">Free polish</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* portrait */}
        <div className="flex min-w-0 flex-[1_1_360px] justify-center pb-14 md:py-16">
          <div className="relative w-full max-w-[430px]">
            <ArchFrame className="aspect-[3/4] w-full">
              <Image
                src={PHOTOS.hero}
                alt="A woman at a dressing table wearing a fine silver pendant"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 430px"
                className="object-cover object-[52%_28%]"
              />
            </ArchFrame>

            <p className="absolute bottom-12 -left-3 flex items-center gap-2.5 rounded-pill border border-silver/60 bg-cream-50 px-5 py-2.5 shadow-[0_8px_24px_rgba(30,27,23,0.07)] md:-left-6">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-moss" />
              <span className="swr-meta text-charcoal">Engraved to order</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
