import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
import { PHOTOS } from "@/lib/photos";

/**
 * Wide editorial promo block — big lifestyle image on the left,
 * offer headline + CTA on the right. On mobile, image first then text.
 */
export function MustHavePromo() {
  return (
    <section className="mx-auto max-w-marketing px-5 py-14 md:px-10 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-cream-200">
          <Image
            src={PHOTOS.mustHave}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Bottom overlay card for the deal label, matching ella */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-cream/95 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="swr-meta text-charcoal/55">Sale Up To 30% Off</p>
              <p className="font-serif text-[16px] text-charcoal mt-0.5">
                <i>Made-to-order pendants</i>
              </p>
            </div>
            <span className="font-script text-gold text-[32px] leading-none">30%</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 max-w-md">
          <Eyebrow withRule>Must Have</Eyebrow>
          <p className="swr-meta text-gold">Sale Up To 30% Off</p>
          <h2 className="swr-h1 italic">Made-to-order silver, on your name.</h2>
          <ShimmerLine />
          <p className="swr-lede">
            For a short season, free engraving on every pendant. Tell us a name,
            a date, a small word — we&apos;ll sketch it by hand and have it on
            its way in ten days.
          </p>
          <ButtonLink href="/shop?cat=pendant" variant="primary" size="lg" className="mt-2">
            Shop pendants
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
