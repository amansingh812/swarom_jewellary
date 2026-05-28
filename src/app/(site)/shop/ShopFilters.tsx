"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { Icon } from "@/components/ui/Icon";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "pendant", label: "Pendants" },
  { key: "ring", label: "Rings" },
  { key: "bracelet", label: "Bracelets" },
  { key: "anklet", label: "Anklets" },
  { key: "for-two", label: "For two" },
];

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price · low to high" },
  { key: "price-desc", label: "Price · high to low" },
];

export function ShopFilters({ active, sort }: { active: string; sort: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "all" || value === "newest") next.delete(key);
    else next.set(key, value);
    router.push(`/shop${next.toString() ? `?${next.toString()}` : ""}`);
  }

  const currentSort = SORTS.find((s) => s.key === sort) ?? SORTS[0];

  return (
    <div className="flex flex-col gap-3 border-y border-[var(--hairline)] py-5 mb-8 md:flex-row md:items-center md:justify-between md:py-6 md:mb-12">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 md:overflow-visible md:mx-0 md:px-0">
        <span className="swr-meta text-charcoal/50 mr-1 shrink-0">Filter</span>
        {CATEGORIES.map((c) => (
          <Pill
            key={c.key}
            active={active === c.key}
            onClick={() => setParam("cat", c.key)}
          >
            {c.label}
          </Pill>
        ))}
      </div>
      <div className="flex items-center gap-2 relative">
        <span className="swr-meta text-charcoal/50 mr-1">Sort</span>
        <Pill ghost onClick={() => setSortOpen((v) => !v)}>
          {currentSort.label} <Icon name="chevron-down" size={10} />
        </Pill>
        {sortOpen && (
          <div className="absolute right-0 top-full mt-2 z-30 bg-cream-50 border border-[var(--hairline)] rounded-lg shadow-card py-2 min-w-[200px] animate-fadeup">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setParam("sort", s.key);
                  setSortOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 font-sans text-[12px] tracking-wide hover:bg-cream-200 ${
                  s.key === sort ? "text-charcoal font-medium" : "text-charcoal/70"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
