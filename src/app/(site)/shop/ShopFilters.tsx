"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategoryOption {
  key: string;
  label: string;
}

/** Fallback only — the real list is derived from the catalogue and passed in. */
const CATEGORIES: CategoryOption[] = [
  { key: "all", label: "All Pieces" },
  { key: "pendant", label: "Pendants" },
  { key: "ring", label: "Rings" },
  { key: "bracelet", label: "Bracelets" },
  { key: "anklet", label: "Anklets" },
  { key: "for-two", label: "For Two" },
];

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price · low to high" },
  { key: "price-desc", label: "Price · high to low" },
];

/**
 * Sticky filter sidebar — label-caps section headings over thin gold-grey
 * dividers, with quiet text links (category) and radio dots (sort).
 */
export function ShopFilters({
  active,
  sort,
  categories,
}: {
  active: string;
  sort: string;
  categories?: CategoryOption[];
}) {
  const categoryList = categories?.length ? categories : CATEGORIES;
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "all" || value === "newest") next.delete(key);
    else next.set(key, value);
    router.push(`/shop${next.toString() ? `?${next.toString()}` : ""}`);
  }

  return (
    <div className="lg:sticky lg:top-36 flex flex-row lg:flex-col gap-10 lg:gap-12 overflow-x-auto no-scrollbar lg:overflow-visible">
      {/* Category */}
      <div className="shrink-0 min-w-[160px]">
        <h3 className="swr-eyebrow !text-charcoal border-b border-silver/40 pb-3 mb-5">
          Category
        </h3>
        <ul className="m-0 list-none p-0 space-y-3.5">
          {categoryList.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => setParam("cat", c.key)}
                className={`font-sans text-[15px] transition-colors duration-300 ${
                  active === c.key
                    ? "text-gold swr-underline-anim"
                    : "text-charcoal-700 hover:text-gold"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div className="shrink-0 min-w-[180px]">
        <h3 className="swr-eyebrow !text-charcoal border-b border-silver/40 pb-3 mb-5">
          Sort
        </h3>
        <div className="flex flex-col gap-3.5">
          {SORTS.map((s) => {
            const selected = s.key === sort;
            return (
              <label
                key={s.key}
                className="group flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sort"
                  className="sr-only"
                  checked={selected}
                  onChange={() => setParam("sort", s.key)}
                />
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                    selected
                      ? "border-gold"
                      : "border-silver group-hover:border-gold"
                  }`}
                  aria-hidden
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-gold" />}
                </span>
                <span
                  className={`font-sans text-[14px] transition-colors ${
                    selected ? "text-charcoal" : "text-charcoal-700 group-hover:text-gold"
                  }`}
                >
                  {s.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
