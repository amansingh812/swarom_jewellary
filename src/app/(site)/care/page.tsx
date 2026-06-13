import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
import { Icon } from "@/components/ui/Icon";

export const metadata = {
  title: "Care",
  description:
    "How to keep your Swarom piece looking like the day it left the bench.",
};

export default function CarePage() {
  return (
    <article className="mx-auto max-w-editorial px-5 pt-12 pb-16 md:px-10 md:pt-20 md:pb-24">
      <header className="flex flex-col items-center text-center gap-5 pb-10 md:pb-14">
        <Eyebrow withRule>Care Guide</Eyebrow>
        <h1 className="swr-h1">Silver, kept.</h1>
        <ShimmerLine />
        <p className="swr-lede max-w-[520px]">
          A few small habits that keep a Swarom piece looking like the day it
          left the bench.
        </p>
      </header>

      <div className="flex flex-col gap-10 mt-6">
        <Tip
          n="01"
          title="Wear it"
          icon="heart"
          body="Silver wants to be worn. The oils on skin keep it bright. The pieces that sit in a drawer are the ones that tarnish — wear yours often."
        />
        <Tip
          n="02"
          title="Keep it dry"
          icon="leaf"
          body="Take it off before a shower, a pool, or the sea. Salt and chlorine are the only two things 925 silver doesn't like. Sweat is fine. Rain is fine."
        />
        <Tip
          n="03"
          title="Perfume goes on first"
          icon="sparkle"
          body="Spritz perfume, hairspray, sunscreen — and let them settle for a minute — before you put the piece on. The alcohol in them clouds silver."
        />
        <Tip
          n="04"
          title="A soft wipe is plenty"
          icon="stamp"
          body="The cotton cloth that comes in your box is all you need. Rub gently along the silver, not in circles. Polish brings the light back."
        />
        <Tip
          n="05"
          title="Patina is welcome"
          icon="shield"
          body="Silver darkens with time. Some people love that — it makes engraving stand out. If you don't, the cloth above brings the shine back in under a minute."
        />
      </div>

      <section className="mt-16 border-t border-[var(--hairline)] pt-10">
        <h2 className="swr-h2 mb-4">If it ever breaks</h2>
        <p className="font-sans text-[15px] leading-relaxed text-charcoal/80 max-w-[560px]">
          Write to us. We will repair it. Most of our pieces come back to the
          bench every few years for a polish, and we don&apos;t charge for that.
          We just want the silver to keep moving with you.
        </p>
        <a
          href="mailto:hello@swarom.in"
          className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal inline-flex items-center gap-2 mt-6 py-2"
        >
          <Icon name="mail" size={12} /> hello@swarom.in
        </a>
      </section>
    </article>
  );
}

function Tip({
  n,
  title,
  body,
  icon,
}: {
  n: string;
  title: string;
  body: string;
  icon: "heart" | "leaf" | "sparkle" | "stamp" | "shield";
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 md:gap-6 items-start border-b border-[var(--hairline)] pb-10 last:border-b-0 last:pb-0">
      <span className="font-serif italic text-[40px] md:text-[52px] leading-none text-gold-soft">
        {n}
      </span>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon name={icon} size={14} className="text-gold" />
          <h3 className="swr-h4">{title}</h3>
        </div>
        <p className="font-sans text-[14px] md:text-[15px] leading-relaxed text-charcoal/70 max-w-[520px]">
          {body}
        </p>
      </div>
    </div>
  );
}
