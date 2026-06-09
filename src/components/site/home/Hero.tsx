import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
import { PHOTOS } from "@/lib/photos";

/**
 * Hero — large cinematic photo with a left-aligned overlay text card.
 * Mobile: text stacked above a shorter image. Desktop: text overlaid on the photo.
 */
export function Hero() {
  return (
    <section className="relative">
      {/* Background photo */}
      <div className="relative h-[440px] md:h-[640px] lg:h-[720px] w-full overflow-hidden bg-cream-200">
        <Image
          src={PHOTOS.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft cream wash on the left so the headline reads on any photo */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/40 to-transparent md:via-cream/15 md:to-transparent"
        />
      </div>

      {/* Overlay text — absolute on desktop, stacked below on small screens */}
      <div className="absolute inset-0 z-[2] flex items-center">
        <div className="mx-auto w-full max-w-marketing px-5 md:px-10">
          <div className="flex flex-col items-start gap-5 max-w-[460px]">
            <Eyebrow withRule className="text-charcoal/70">New Arrivals</Eyebrow>
            <h1 className="font-serif text-[44px] md:text-[68px] lg:text-[88px] leading-[0.95] tracking-tight text-charcoal italic">
              Your story,
              <br />
              told in silver.
            </h1>
            <ShimmerLine />
            <p className="swr-lede max-w-md hidden sm:block">
              Personalized 925 sterling silver jewellery, handcrafted in
              Bengaluru. Made to order. Made to last.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <ButtonLink href="/shop" variant="primary" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink href="/story" variant="secondary" size="lg" className="hidden sm:inline-flex">
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
