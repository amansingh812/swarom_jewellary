import { Icon, IconName } from "@/components/ui/Icon";

interface Badge {
  icon: IconName;
  title: string;
  body: string;
}

const BADGES: Badge[] = [
  {
    icon: "truck",
    title: "Free shipping",
    body: "On every order across India. Bluedart / DTDC, tracked.",
  },
  {
    icon: "shield",
    title: "30-day returns",
    body: "Including engraved pieces. We want it right for you.",
  },
  {
    icon: "stamp",
    title: "Hallmarked 925",
    body: "Pure sterling silver, hallmarked with the year it was made.",
  },
];

/**
 * Three-up trust badges row, hairline icons, no shadows.
 * Sits above the Image Gallery and Newsletter.
 */
export function TrustStrip() {
  return (
    <section className="border-y border-silver/40 py-12 md:py-16 bg-cream">
      <div className="mx-auto max-w-marketing px-6 md:px-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {BADGES.map((b) => (
            <div key={b.title} className="flex flex-col items-center gap-3 text-center">
              <span className="text-gold" aria-hidden>
                <Icon name={b.icon} size={22} />
              </span>
              <h3 className="swr-eyebrow !text-charcoal">{b.title}</h3>
              <p className="font-sans text-[13px] leading-relaxed text-charcoal-700 max-w-[280px] m-0">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
