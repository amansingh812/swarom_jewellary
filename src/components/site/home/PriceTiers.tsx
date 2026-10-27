import Link from "next/link";

const TIERS = [
  { href: "/shop?under=3000", amount: "Under ₹3,000", note: "Letters, charms, a first piece" },
  { href: "/shop?under=5000", amount: "Under ₹5,000", note: "Pendants, bracelets, anklets" },
  { href: "/shop?under=8000", amount: "Under ₹8,000", note: "Rings, pairs, keepsakes" },
];

/** Gifting by budget — the fastest route in for someone shopping for a present. */
export function PriceTiers() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-marketing px-6 py-16 md:px-10 md:py-20 lg:px-20">
        <div className="mb-10 text-center md:mb-12">
          <p className="swr-eyebrow mb-3.5">Gifting made simple</p>
          <h2 className="font-serif text-[28px] leading-[1.2] text-charcoal md:text-[36px]">
            Shop by budget
          </h2>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3 md:gap-6">
          {TIERS.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="group flex flex-col items-center gap-2.5 border border-silver/40 bg-cream-50 px-7 py-11 text-center transition-colors duration-300 hover:border-gold-soft"
              >
                <span className="font-serif text-[28px] text-charcoal md:text-[32px]">
                  {t.amount}
                </span>
                <span className="font-sans text-[13px] font-light text-charcoal-700">
                  {t.note}
                </span>
                <span className="swr-meta mt-2 text-gold">Browse →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
