"use client";

import { useState } from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { useCart } from "@/lib/cart/CartProvider";
import { formatINR } from "@/lib/money";
import { WishlistButton } from "@/components/site/WishlistButton";
import type { Product } from "@/lib/supabase/types";

interface ProductDetailProps {
  product: Product;
  initialInWishlist?: boolean;
}

interface OptionSpec {
  type: "text" | "select";
  label: string;
  max?: number;
  choices?: string[];
  default?: string;
}

export function ProductDetail({ product, initialInWishlist = false }: ProductDetailProps) {
  const opts = (product.options ?? {}) as unknown as Record<string, OptionSpec>;

  // Initialize state for every option declared on the product.
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const [k, spec] of Object.entries(opts)) {
      init[k] = spec.default ?? (spec.type === "text" ? "" : spec.choices?.[0] ?? "");
    }
    return init;
  });
  const [thumb, setThumb] = useState(0);
  const [adding, setAdding] = useState(false);
  const { add } = useCart();

  const images = product.images?.length
    ? product.images
    : product.image_main
    ? [product.image_main]
    : ["/products/pendant.svg"];

  function setOption(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function addToBag() {
    setAdding(true);
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      modifier: product.modifier ?? undefined,
      image: product.image_main ?? images[0],
      price: product.price,
      quantity: 1,
      options: values,
    });
    setTimeout(() => setAdding(false), 800);
  }

  // Find the primary engraving option (first text input) for the live preview.
  const engravingKey = Object.entries(opts).find(([, s]) => s.type === "text")?.[0];
  const engravingValue = engravingKey ? values[engravingKey] : "";

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[7fr_5fr] md:gap-14">
        {/* ─── Gallery ─────────────────────────────────────── */}
        <div className="md:grid md:grid-cols-[80px_1fr] md:gap-4">
          {/* Main image — first on mobile */}
          <div className="relative aspect-[4/4.5] md:aspect-[4/5] rounded-lg overflow-hidden bg-cream-200 md:order-2">
            <Image
              src={images[thumb]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="swr-grain absolute inset-0 opacity-50" />
          </div>
          {/* Thumbs — bottom on mobile, left on desktop */}
          {images.length > 1 && (
            <div className="flex flex-row md:flex-col gap-2 md:order-1 overflow-x-auto no-scrollbar md:overflow-visible">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setThumb(i)}
                  className={`shrink-0 w-16 h-20 md:w-full md:h-[100px] overflow-hidden border transition-colors ${
                    thumb === i ? "border-gold" : "border-[var(--hairline)] hover:border-gold-soft"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={src} alt="" width={80} height={100} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Info column ────────────────────────────────── */}
        <aside className="flex flex-col gap-4">
          <Eyebrow withRule>The Everyday</Eyebrow>
          <h1 className="swr-h1">
            {product.name}{" "}
            {product.modifier && <i>{product.modifier}</i>}
          </h1>
          {product.description && (
            <p className="swr-lede">{product.description}</p>
          )}

          <div className="flex items-baseline gap-3 mt-2">
            <span className="swr-price-lg">{formatINR(product.price)}</span>
            {product.meta && <span className="swr-meta">{product.meta}</span>}
          </div>

          <div className="h-px bg-[var(--hairline)] my-3" />

          {/* Options */}
          {Object.entries(opts).map(([key, spec]) =>
            spec.type === "text" ? (
              <div key={key} className="flex flex-col gap-2">
                <label className="swr-meta text-charcoal">
                  {spec.label}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={values[key]}
                    onChange={(e) =>
                      setOption(key, e.target.value.slice(0, spec.max ?? 30))
                    }
                    maxLength={spec.max ?? 30}
                    placeholder={spec.label}
                    className="w-full bg-transparent border-b border-[var(--hairline-strong)] px-0 py-3 pr-14 font-sans text-[15px] text-charcoal outline-none focus:border-gold transition-colors"
                  />
                  {spec.max && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[10px] tracking-wider text-charcoal/50">
                      {values[key].length}/{spec.max}
                    </span>
                  )}
                </div>
                {key === engravingKey && (
                  <div className="bg-cream-200 px-5 py-4 text-center mt-1">
                    <span className="font-serif italic text-[26px] md:text-[28px] text-charcoal">
                      {engravingValue || "—"}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div key={key} className="flex flex-col gap-2">
                <label className="swr-meta text-charcoal">{spec.label}</label>
                <div className="flex flex-wrap gap-2">
                  {spec.choices?.map((c) => (
                    <Pill
                      key={c}
                      active={values[key] === c}
                      onClick={() => setOption(key, c)}
                    >
                      {c}
                    </Pill>
                  ))}
                </div>
              </div>
            )
          )}

          {/* CTA row (desktop) */}
          <div className="hidden md:flex flex-col gap-3 mt-3">
            <div className="flex gap-2">
              <Button onClick={addToBag} variant="primary" size="lg" block disabled={adding} className="flex-1">
                {adding ? "Adding…" : `Add to bag — ${formatINR(product.price)}`}
              </Button>
              <WishlistButton
                productId={product.id}
                initialInWishlist={initialInWishlist}
                variant="pdp"
                redirectAfter={`/product/${product.slug}`}
              />
            </div>
            <a
              href={`https://wa.me/919999999999?text=Hi%20Swarom%2C%20I%27d%20like%20to%20ask%20about%20${encodeURIComponent(product.name + " " + (product.modifier ?? ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-center swr-meta text-charcoal border-b border-[var(--hairline)] py-2 hover:border-charcoal flex items-center gap-2"
            >
              <Icon name="whatsapp" size={12} /> Ask on WhatsApp
            </a>
          </div>

          {/* Trust bullets */}
          <ul className="list-none p-0 m-0 mt-4 flex flex-col gap-2.5">
            <Bullet icon="stamp">Hallmarked 925 sterling silver</Bullet>
            <Bullet icon="truck">Free shipping across India</Bullet>
            <Bullet icon="shield">30-day return — engraved pieces included</Bullet>
          </ul>

          {/* Accordions */}
          <Accordion title="Details & care">
            Wipe with the cotton cloth that comes in your box. Avoid perfume and pool
            water. Silver darkens with time — that&apos;s the patina; rub it lightly to
            bring back the shine.
          </Accordion>
          <Accordion title="How it’s made">
            Each piece is cast individually from your engraving, then hand-finished and
            polished. We mark every pendant with the year it was made.
          </Accordion>
          <Accordion title="Shipping">
            Made to order in our Bengaluru studio. Ready to ship within 10 days. Free
            shipping across India via DTDC / Bluedart.
          </Accordion>
        </aside>
      </div>

      {/* Sticky add-to-bag CTA (mobile only) */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-cream/95 backdrop-blur-sm border-t border-[var(--hairline)] px-4 py-3 flex items-center gap-3">
        <div className="flex flex-col">
          <span className="swr-meta text-charcoal/55">{product.name}</span>
          <span className="swr-price-lg text-[18px]">{formatINR(product.price)}</span>
        </div>
        <Button onClick={addToBag} variant="primary" size="lg" disabled={adding} className="flex-1">
          {adding ? "Adding…" : "Add to bag"}
        </Button>
      </div>
    </>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: "stamp" | "truck" | "shield";
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2.5 font-sans text-[13px] text-charcoal/80">
      <Icon name={icon} size={14} className="text-gold" />
      <span>{children}</span>
    </li>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="border-t border-[var(--hairline)] py-4 group">
      <summary className="flex items-center justify-between cursor-pointer list-none swr-meta text-charcoal">
        <span>{title}</span>
        <Icon
          name="chevron-down"
          size={12}
          className="transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <p className="font-sans text-[13px] leading-relaxed text-charcoal/65 mt-3">{children}</p>
    </details>
  );
}
