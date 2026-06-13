import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PHOTOS } from "@/lib/photos";

export const metadata = {
  title: "Story",
  description:
    "Swarom is a small studio in Bengaluru. We make personalized silver jewellery — the kind you wear every day.",
};

export default function StoryPage() {
  return (
    <article className="pb-section-gap">
      {/* Hero — split editorial: title left, photograph right */}
      <header className="mx-auto max-w-marketing grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-10 md:gap-20 items-center px-6 pt-14 md:px-20 md:pt-24 pb-16 md:pb-28">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow withRule>Our Story</Eyebrow>
          <h1 className="swr-h1">
            The genesis of
            <br />
            <i>a small maison.</i>
          </h1>
          <div className="swr-gold-divider max-w-[96px]" aria-hidden />
          <p className="swr-lede max-w-[480px]">
            Swarom is a small studio in Bengaluru. We make personalized silver
            jewellery — the kind you wear every day, with a name or a date
            hidden where only you can find it.
          </p>
          <span className="swr-meta">Bengaluru · Est. 2026</span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
          <Image
            src={PHOTOS.mustHave}
            alt="The Swarom bench"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
      </header>

      {/* Pull quote */}
      <section className="bg-cream-100 py-16 md:py-24">
        <div className="mx-auto max-w-editorial px-6 text-center flex flex-col items-center gap-6">
          <span className="swr-eyebrow">The Philosophy</span>
          <blockquote className="font-serif italic text-[24px] md:text-[32px] leading-[1.4] tracking-[0.02em] text-charcoal m-0">
            &ldquo;We do not simply engrave names; we curate moments of
            permanent light. Every piece must whisper its story before it ever
            catches the eye.&rdquo;
          </blockquote>
          <span className="swr-meta">— Anjali, Founder</span>
        </div>
      </section>

      {/* Chapter 1 — image left, text right */}
      <section className="mx-auto max-w-marketing grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center px-6 py-16 md:px-20 md:py-28">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
          <Image
            src={PHOTOS.collection1}
            alt="Early sketches and castings"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-5 max-w-md">
          <Eyebrow>Chapter One</Eyebrow>
          <h2 className="swr-h2">
            A quiet beginning <i>in Bengaluru.</i>
          </h2>
          <div className="swr-gold-divider max-w-[64px]" aria-hidden />
          <p className="font-sans text-[15px] md:text-[16px] leading-[1.75] text-charcoal-700 m-0">
            Swarom began because we couldn&apos;t find what we were looking for
            — silver that felt like an heirloom, but priced like an everyday
            thing. So we learned to cast, and to engrave, and to listen
            carefully when someone tells us a name.
          </p>
        </div>
      </section>

      {/* Chapter 2 — text left, image right (offset) */}
      <section className="mx-auto max-w-marketing grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center px-6 pb-16 md:px-20 md:pb-28">
        <div className="flex flex-col items-start gap-5 max-w-md order-2 md:order-1">
          <Eyebrow>Chapter Two</Eyebrow>
          <h2 className="swr-h2">
            One set of hands, <i>sketch to send-off.</i>
          </h2>
          <div className="swr-gold-divider max-w-[64px]" aria-hidden />
          <p className="font-sans text-[15px] md:text-[16px] leading-[1.75] text-charcoal-700 m-0">
            Every piece passes through one set of hands, from sketch to
            send-off. We never make more than we can polish carefully. It takes
            about ten days to make a piece. We think that&apos;s just right.
          </p>
          <p className="swr-signature mt-4 text-[40px]">— Anjali · founder</p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-200 order-1 md:order-2 md:mt-20">
          <Image
            src={PHOTOS.ringModel}
            alt="Polishing at the bench"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* The Pillars of Our Craft */}
      <section className="border-t border-silver/40 pt-16 md:pt-24">
        <div className="mx-auto max-w-marketing px-6 md:px-20">
          <div className="flex flex-col items-center gap-4 mb-12 md:mb-16 text-center">
            <Eyebrow withRule>The Pillars of Our Craft</Eyebrow>
            <p className="swr-lede max-w-[560px]">
              Materials we can trace, time we refuse to rush, and a standard we
              hold with our own hands.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-8">
            {[
              {
                image: PHOTOS.gallery[0],
                title: "Hallmarked 925",
                body: "Pure sterling silver, hallmarked with the year it was made — never plated, never hollow.",
              },
              {
                image: PHOTOS.gallery[1],
                title: "Traceable Sourcing",
                body: "Silver from certified refiners, melted and cast in our own studio in Bengaluru.",
              },
              {
                image: PHOTOS.gallery[2],
                title: "Time",
                body: "Ten days from sketch to send-off. We never make more than we can polish carefully.",
              },
            ].map((p) => (
              <div key={p.title} className="flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-cream-200 mb-6">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-[20px] font-medium tracking-[0.01em] text-charcoal mb-2">
                  {p.title}
                </h3>
                <p className="font-sans text-[14px] leading-relaxed text-charcoal-700 m-0">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press strip */}
      <section className="mx-auto max-w-marketing border-t border-silver/40 mt-16 pt-12 text-center md:mt-24 md:pt-16 px-6 md:px-20">
        <span className="swr-meta">As seen in</span>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[18px] md:text-[22px] text-charcoal-700 font-serif italic">
          <span>The Hindu</span>
          <span>Vogue India</span>
          <span>Mint Lounge</span>
          <span>Conde Nast Traveller</span>
        </div>
      </section>
    </article>
  );
}
