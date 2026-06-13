import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { PHOTOS } from "@/lib/photos";

/**
 * Hero — split editorial composition. Left: ivory panel with display
 * headline and CTAs. Right: full-bleed portrait photograph.
 * Stacks photo-under-text on mobile.
 */
export function Hero() {
  return (
    <section className="relative bg-cream">
      <div className="mx-auto grid max-w-marketing grid-cols-1 md:grid-cols-2 md:min-h-[640px] lg:min-h-[700px]">
        {/* Left: text panel */}
        <div className="relative flex items-center bg-cream-100 overflow-hidden">
          <div aria-hidden className="swr-orb swr-orb-2" />
          <div className="relative z-[1] flex flex-col items-start gap-6 px-6 py-16 md:px-14 lg:px-20 md:py-24">
            <Eyebrow withRule>Handcrafted in Bengaluru</Eyebrow>
            <h1 className="font-serif text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] tracking-[0.05em] text-charcoal uppercase">
              Your story,
              <br />
              <i className="normal-case tracking-[0.03em]">told in silver.</i>
            </h1>
            <div className="swr-gold-divider max-w-[96px]" aria-hidden />
            <p className="swr-lede max-w-md">
              Personalized 925 sterling silver jewellery, made to order and
              made to last. Each piece begins as a sketch at our bench.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <ButtonLink href="/shop" variant="primary" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink href="/story" variant="secondary" size="lg" className="hidden sm:inline-flex">
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Right: portrait photo */}
        <div className="relative h-[420px] md:h-auto overflow-hidden bg-cream-200">
          <Image
            src={PHOTOS.hero}
            alt="Swarom silver jewellery worn by a model"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
