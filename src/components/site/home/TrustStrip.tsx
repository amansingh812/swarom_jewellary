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
    <section className="border-y border-[var(--hairline)] py-10 md:py-14 bg-cream">
      <div className="mx-auto max-w-marketing px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {BADGES.map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--hairline-strong)] text-charcoal">
                <Icon name={b.icon} size={16} />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif font-medium text-[16px] text-charcoal">
                  {b.title}
                </h3>
                <p className="font-sans text-[13px] leading-relaxed text-charcoal/65 max-w-[280px]">
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
