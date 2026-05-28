import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShimmerLine } from "@/components/ui/ShimmerLine";

export const metadata = {
  title: "Story",
  description:
    "Swarom is a small studio in Bengaluru. We make personalized silver jewellery — the kind you wear every day.",
};

export default function StoryPage() {
  return (
    <article className="mx-auto max-w-catalog px-5 pt-12 pb-16 md:px-10 md:pt-20 md:pb-24">
      {/* Hero */}
      <header className="flex flex-col items-center text-center gap-5 pb-12 md:pb-20">
        <Eyebrow withRule>Our Story</Eyebrow>
        <h1 className="swr-display">
          We make one thing.
          <br />
          <i>We try to make it well.</i>
        </h1>
        <ShimmerLine />
        <p className="swr-lede max-w-[580px]">
          Swarom is a small studio in Bengaluru. We make personalized silver
          jewellery — the kind you wear every day, with a name or a date hidden
          where only you can find it.
        </p>
      </header>

      {/* Founder note + image */}
      <section className="grid grid-cols-1 gap-10 border-t border-[var(--hairline)] pt-12 md:grid-cols-[5fr_7fr] md:gap-16 md:pt-20">
        <figure className="m-0">
          <div className="rounded-xl overflow-hidden bg-cream-200 aspect-[4/5]">
            <Image
              src="/products/bracelet.svg"
              alt=""
              width={600}
              height={750}
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="font-serif italic text-[14px] text-charcoal/50 text-center mt-3">
            The bench, 8 a.m.
          </figcaption>
        </figure>
        <div>
          <h2 className="swr-h2 mb-6">From the maker</h2>
          <p className="font-sans text-[15px] md:text-[16px] leading-[1.75] text-charcoal/80 mb-5 max-w-[560px]">
            I started Swarom because I couldn&apos;t find what I was looking
            for — silver that felt like an heirloom, but priced like an
            everyday thing. So I learned to cast, and to engrave, and to listen
            carefully when someone tells me a name.
          </p>
          <p className="font-sans text-[15px] md:text-[16px] leading-[1.75] text-charcoal/80 mb-5 max-w-[560px]">
            Every piece passes through one set of hands, from sketch to send-off.
            We never make more than we can polish carefully. It takes about ten
            days to make a piece. We think that&apos;s just right.
          </p>
          <p
            className="swr-signature mt-8 text-[42px]"
            style={{ display: "block" }}
          >
            — Anjali · founder
          </p>
        </div>
      </section>

      {/* Press strip */}
      <section className="border-t border-[var(--hairline)] mt-16 pt-12 text-center md:mt-24 md:pt-16">
        <span className="swr-meta text-charcoal/50">As seen in</span>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[18px] md:text-[22px] text-charcoal/65 font-serif italic">
          <span>The Hindu</span>
          <span>Vogue India</span>
          <span>Mint Lounge</span>
          <span>Conde Nast Traveller</span>
        </div>
      </section>
    </article>
  );
}
