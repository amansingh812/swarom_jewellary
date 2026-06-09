"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatINR } from "@/lib/money";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";

interface Props {
  /** Pre-fetched all products. We filter client-side by tab. */
  products: Product[];
}

const TABS: { key: Product["category"] | "all"; label: string }[] = [
  { key: "pendant", label: "Pendant" },
  { key: "ring", label: "Ring" },
  { key: "bracelet", label: "Bracelet" },
  { key: "anklet", label: "Anklet" },
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
    <section className="mx-auto max-w-marketing px-5 py-14 md:px-10 md:py-20">
      {/* Header row — section title + tab pills */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
        <div>
          <Eyebrow>Top picks</Eyebrow>
          <h2 className="swr-h2 mt-2 italic">A few, well-loved.</h2>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto no-scrollbar md:overflow-visible px-1">
          {TABS.map((t) => (
            <Pill
              key={t.key}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Pill>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center font-serif italic text-charcoal/55">
          Nothing in this corner yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-10">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group flex flex-col gap-3"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-cream-200">
                {p.image_main && (
                  <Image
                    src={p.image_main}
                    alt={`${p.name} ${p.modifier ?? ""}`}
                    width={400}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 px-0.5">
                <h3 className="swr-h4">
                  {p.name}{" "}
                  {p.modifier && (
                    <i className="font-normal text-charcoal/65">{p.modifier}</i>
                  )}
                </h3>
                <span className="swr-price">{formatINR(p.price)}</span>
                <span className="swr-meta text-charcoal/55 mt-1 inline-flex items-center gap-1 group-hover:text-charcoal transition-colors">
                  Shop now <Icon name="arrow-right" size={10} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
