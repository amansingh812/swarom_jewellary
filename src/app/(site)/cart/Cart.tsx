"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { formatINR } from "@/lib/money";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { contactHref } from "@/lib/contact";

export function Cart() {
  const { lines, remove, updateQty, subtotal, count, ready } = useCart();

  if (!ready) {
    return (
      <div className="mx-auto max-w-marketing px-5 py-20 md:px-10">
        <p className="swr-meta text-charcoal/50">Loading…</p>
      </div>
    );
  }

  const shipping = subtotal > 0 ? 0 : 0; // Free shipping across India
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-editorial px-5 pt-16 pb-24 md:px-10 md:pt-24 text-center flex flex-col items-center gap-5">
        <Eyebrow withRule>Your bag</Eyebrow>
        <h1 className="swr-h1">
          <i>It is quiet here.</i>
        </h1>
        <p className="swr-lede max-w-[440px]">
          Pieces you add will rest here, ready when you are.
        </p>
        <ButtonLink href="/shop" variant="primary" size="lg" className="mt-4">
          Start browsing
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-marketing px-5 pt-10 pb-24 md:px-10 md:pt-16">
      <header className="flex items-baseline justify-between mb-8 md:mb-12">
        <h1 className="swr-h1">
          Your bag{" "}
          <span className="swr-meta !text-gold align-middle ml-2">
            {count} item{count === 1 ? "" : "s"}
          </span>
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[7fr_5fr] md:gap-16">
        {/* Lines */}
        <ul className="m-0 p-0 list-none">
          {lines.map((line) => (
            <li
              key={line.key}
              className="grid grid-cols-[80px_1fr] gap-4 py-6 border-b border-[var(--hairline)] md:grid-cols-[120px_1fr_auto] md:gap-6 md:py-8"
            >
              <Link
                href={`/product/${line.slug}`}
                className="overflow-hidden bg-cream-200 aspect-[4/5] w-20 md:w-[120px]"
              >
                <Image
                  src={line.image}
                  alt=""
                  width={120}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex flex-col gap-1 min-w-0">
                <Link
                  href={`/product/${line.slug}`}
                  className="font-serif font-medium text-[16px] md:text-[18px] text-charcoal hover:text-gold transition-colors"
                >
                  {line.name}{" "}
                  {line.modifier && (
                    <i className="font-normal text-charcoal/65">{line.modifier}</i>
                  )}
                </Link>
                {line.options &&
                  Object.entries(line.options).map(([k, v]) => (
                    <span key={k} className="swr-meta text-charcoal/55">
                      {k} ·{" "}
                      <i className="font-serif italic text-charcoal/75 normal-case tracking-normal">
                        {v}
                      </i>
                    </span>
                  ))}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => updateQty(line.key, line.quantity - 1)}
                    aria-label="Decrease"
                    className="h-8 w-8 rounded-full border border-[var(--hairline)] flex items-center justify-center hover:border-charcoal"
                  >
                    <Icon name="minus" size={10} />
                  </button>
                  <span className="font-sans text-[13px] text-charcoal w-6 text-center">
                    {line.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(line.key, line.quantity + 1)}
                    aria-label="Increase"
                    className="h-8 w-8 rounded-full border border-[var(--hairline)] flex items-center justify-center hover:border-charcoal"
                  >
                    <Icon name="plus" size={10} />
                  </button>
                  <button
                    onClick={() => remove(line.key)}
                    className="swr-meta text-charcoal/50 border-b border-[var(--hairline)] hover:text-oxide hover:border-oxide ml-3"
                  >
                    Remove
                  </button>
                </div>

                {/* Mobile price */}
                <span className="swr-price-lg mt-3 md:hidden">
                  {formatINR(line.price * line.quantity)}
                </span>
              </div>

              {/* Desktop price */}
              <span className="swr-price-lg hidden md:block self-start">
                {formatINR(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="md:sticky md:top-24 h-fit rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8 flex flex-col gap-3">
          <Eyebrow>Summary</Eyebrow>
          <Row label="Subtotal" value={formatINR(subtotal)} />
          <Row label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
          <div className="h-px bg-[var(--hairline)] my-2" />
          <Row label="Total" value={formatINR(total)} large />
          <p className="font-sans text-[11px] text-charcoal/50 mt-1">
            Taxes included. Free shipping across India. Made to order — 10 days
            from now.
          </p>
          <ButtonLink href="/checkout" variant="primary" size="lg" block className="mt-3">
            Proceed to checkout
          </ButtonLink>
          <Link
            href="/shop"
            className="swr-meta text-center text-charcoal/65 hover:text-charcoal py-2"
          >
            Continue browsing
          </Link>

          <div className="mt-4 pt-4 border-t border-[var(--hairline)] flex flex-col gap-2">
            <RowLine icon="shield">30-day return — engraved pieces included</RowLine>
            <RowLine icon="truck">Free shipping across India</RowLine>
            <RowLine icon="whatsapp">
              <a
                href={contactHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                Questions? WhatsApp us
              </a>
            </RowLine>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={large ? "swr-eyebrow text-charcoal" : "swr-meta"}>{label}</span>
      <span className={large ? "swr-price-lg" : "swr-price"}>{value}</span>
    </div>
  );
}

function RowLine({
  icon,
  children,
}: {
  icon: "shield" | "truck" | "whatsapp";
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 font-sans text-[12px] text-charcoal/65">
      <Icon name={icon} size={12} className="text-charcoal/55" />
      <span>{children}</span>
    </div>
  );
}
