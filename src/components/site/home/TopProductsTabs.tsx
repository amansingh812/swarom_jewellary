"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatINR } from "@/lib/money";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface Props {
  /** Pre-fetched all products. We filter client-side by tab. */
  products: Product[];
}

const TABS: { key: Product["category"] | "all"; label: string }[] = [
  { key: "pendant", label: "Pendants" },
  { key: "ring", label: "Rings" },
  { key: "bracelet", label: "Bracelets" },
  { key: "anklet", label: "Anklets" },
];

export function TopProductsTabs({ products }: Props) {
  const [tab, setTab] = useState<Props["products"][number]["category"] | "all">(
    "pendant"
  );

  const filtered = useMemo(
    () =>
      products
        .filter((p) => (tab === "all" ? true : p.category === tab))
        .slice(0, 4),
    [products, tab]
  );

  return (
    <section className="mx-auto max-w-marketing px-6 py-16 md:px-20 md:py-28">
      {/* Centered editorial header */}
      <div className="flex flex-col items-center gap-4 mb-10 md:mb-14 text-center">
        <Eyebrow withRule>Best Sellers</Eyebrow>
        <h2 className="swr-h2">A few, <i>well-loved.</i></h2>
        <div className="mt-2 flex items-center gap-6 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`swr-eyebrow whitespace-nowrap pb-1 transition-colors duration-300 ${
                tab === t.key
                  ? "!text-gold border-b border-gold"
                  : "!text-charcoal-700 border-b border-transparent hover:!text-gold"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center font-serif italic text-charcoal-700">
          Nothing in this corner yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8 md:gap-y-12">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-200 mb-5">
                {p.image_main && (
                  <Image
                    src={p.image_main}
                    alt={`${p.name} ${p.modifier ?? ""}`}
                    width={400}
                    height={500}
                    className="h-full w-full object-cover swr-zoom"
                  />
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex justify-center bg-gradient-to-t from-[var(--silver-light)]/80 to-transparent">
                  <span className="swr-eyebrow swr-underline-anim">View Details</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <h3 className="font-serif text-[18px] md:text-[20px] font-medium leading-[1.4] tracking-[0.01em] text-charcoal">
                  {p.name}{" "}
                  {p.modifier && (
                    <i className="font-normal text-charcoal-700">{p.modifier}</i>
                  )}
                </h3>
                <span className="swr-price">{formatINR(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
