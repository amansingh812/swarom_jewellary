import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { PHOTOS } from "@/lib/photos";

/**
 * Wide editorial promo — borderless lifestyle image beside an airy
 * text column with gold accents, lookbook style.
 */
export function MustHavePromo() {
  return (
    <section className="bg-cream-100">
      <div className="mx-auto max-w-marketing grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center px-6 py-16 md:px-20 md:py-28">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
          <Image
            src={PHOTOS.mustHave}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-5 max-w-md">
          <Eyebrow withRule>Must Have</Eyebrow>
          <p className="swr-eyebrow">Sale Up To 30% Off</p>
          <h2 className="swr-h1">
            Made-to-order silver, <i>on your name.</i>
          </h2>
          <div className="swr-gold-divider max-w-[96px]" aria-hidden />
          <p className="swr-lede">
            For a short season, free engraving on every pendant. Tell us a name,
            a date, a small word — we&apos;ll sketch it by hand and have it on
            its way in ten days.
          </p>
          <ButtonLink href="/shop?cat=pendant" variant="secondary" size="lg" className="mt-2">
            Shop pendants
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
