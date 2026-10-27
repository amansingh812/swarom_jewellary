import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { JaaliPanel, KolamRule } from "@/components/ui/Ornament";
import { Icon } from "@/components/ui/Icon";
import { PHOTOS } from "@/lib/photos";

const POINTS = [
  "Names, dates, initials, a single word",
  "Devanagari, Tamil, Telugu and Latin",
  "Free on every piece — no added cost",
];

/**
 * The engraving block. Left: what it is. Right: a still of the field and the
 * piece it produces, so the idea lands before anyone opens a product page.
 */
export function EngravingFeature() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-marketing px-6 py-16 md:px-10 md:py-24 lg:px-20">
        <div className="relative flex flex-wrap items-stretch overflow-hidden border border-silver/40 bg-cream-50">
          <JaaliPanel className="left-0 top-0 h-full w-[260px]" opacity={0.12} />

          <div className="relative min-w-0 flex-[999_1_420px] px-7 py-12 md:px-14 md:py-16">
            <p className="swr-eyebrow mb-4">The point of it</p>
            <h2 className="font-serif text-[28px] leading-[1.2] text-charcoal md:text-[36px]">
              Write it in your own hand.
            </h2>
            <p className="swr-lede mt-5 max-w-[420px]">
              Type a name and watch it set in silver before you buy. Up to twelve
              letters. Choose our engraver&rsquo;s script, or send your own
              handwriting and we will trace it.
            </p>

            <ul className="m-0 mt-7 flex list-none flex-col gap-3 p-0">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <Icon name="check" size={15} className="text-gold" />
                  <span className="font-sans text-[14px] font-light text-charcoal-700">
                    {p}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <ButtonLink href="/shop" variant="primary" size="lg">
                Try the engraver
              </ButtonLink>
            </div>
          </div>

          <div className="flex min-w-0 flex-[1_1_360px] flex-col items-center justify-center gap-6 bg-cream-200 px-7 py-12 md:px-12">
            <div className="w-full max-w-[300px] border border-silver/50 bg-cream-50 p-6">
              <p className="swr-meta mb-2.5 text-charcoal">Engraving · 12 letters</p>
              <p className="rounded-pill border border-silver bg-cream px-4 py-3 font-sans text-[14px] text-charcoal">
                Aadhya
              </p>
            </div>

            <KolamRule />

            <figure className="relative m-0 aspect-square w-full max-w-[300px] overflow-hidden border border-silver/50 bg-cream-50">
              <Image
                src={PHOTOS.pendant}
                alt="The pendant with the engraving applied"
                fill
                sizes="300px"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent px-5 pb-4 pt-10 text-center">
                <span className="font-serif text-[26px] italic text-cream">Aadhya</span>
              </figcaption>
            </figure>
            <p className="swr-meta">Live preview</p>
          </div>
        </div>
      </div>
    </section>
  );
}
