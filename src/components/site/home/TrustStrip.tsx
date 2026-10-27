import { Icon, IconName } from "@/components/ui/Icon";

const POINTS: { icon: IconName; label: string; note: string }[] = [
  { icon: "stamp", label: "BIS hallmarked", note: "Every piece stamped 925" },
  { icon: "sparkle", label: "Made in Bengaluru", note: "By hand, to order" },
  { icon: "truck", label: "Free shipping", note: "Everywhere in India" },
  { icon: "check", label: "15-day returns", note: "On unengraved pieces" },
  { icon: "whatsapp", label: "Ask us anything", note: "Sizing, gifting, care" },
];

/** The proof line under the hero — five short claims, hairline icons, no badges. */
export function TrustStrip() {
  return (
    <section className="border-y border-silver/40 bg-cream-100">
      <ul className="mx-auto m-0 grid max-w-marketing list-none grid-cols-2 gap-8 px-6 py-10 md:grid-cols-5 md:gap-6 md:px-10 md:py-9 lg:px-20">
        {POINTS.map((p) => (
          <li key={p.label} className="flex flex-col items-center gap-2.5 text-center">
            <Icon name={p.icon} size={22} className="text-gold" />
            <span className="swr-meta text-charcoal">{p.label}</span>
            <span className="font-sans text-[12px] leading-relaxed text-charcoal-700">
              {p.note}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
