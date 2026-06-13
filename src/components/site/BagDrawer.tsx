"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/CartProvider";
import { formatINR } from "@/lib/money";

export function BagDrawer() {
  const { open, setOpen, lines, remove, updateQty, subtotal, count } = useCart();

  // Lock body scroll when open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-[60] bg-charcoal/40 animate-fadeup"
        onClick={() => setOpen(false)}
      />

      {/* Panel — bottom sheet on mobile, right drawer on desktop */}
      <aside
        role="dialog"
        aria-modal
        aria-label="Your bag"
        className="
          fixed z-[61] bg-cream shadow-lift flex flex-col
          inset-x-0 bottom-0 max-h-[88vh] animate-slideup
          md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:max-h-none md:rounded-t-none md:w-[440px] md:max-w-[92vw] md:animate-slidein
        "
      >
        {/* Drag handle (mobile) */}
        <div className="flex md:hidden justify-center pt-2 pb-1">
          <div className="h-1 w-10 rounded-full bg-charcoal/20" />
        </div>

        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--hairline)] md:px-7">
          <span className="font-serif font-medium text-[20px] tracking-wide text-charcoal md:text-[22px]">
            Your bag{" "}
            <span className="swr-meta !text-gold ml-2">{count} item{count === 1 ? "" : "s"}</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center text-charcoal"
          >
            <Icon name="close" size={14} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center min-h-[200px]">
            <p className="font-serif italic text-[20px] text-charcoal/80 m-0">
              Your bag is quiet.
            </p>
            <p className="swr-lede max-w-[280px] text-[14px]">
              Pieces you add will rest here, ready when you are.
            </p>
            <Button variant="secondary" size="md" onClick={() => setOpen(false)} className="mt-3">
              Start browsing
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 md:px-7">
              {lines.map((item) => (
                <li
                  key={item.key}
                  className="grid grid-cols-[64px_1fr_auto] gap-4 py-5 border-b border-[var(--hairline)] items-center md:grid-cols-[72px_1fr_auto]"
                >
                  <div className="aspect-[4/5] w-16 md:w-[72px] overflow-hidden bg-cream-200">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        width={72}
                        height={90}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <strong className="font-serif font-medium text-[15px] text-charcoal truncate">
                      {item.name} {item.modifier && <i className="font-normal text-charcoal/65">{item.modifier}</i>}
                    </strong>
                    {item.options &&
                      Object.entries(item.options).map(([k, v]) => (
                        <span key={k} className="swr-meta text-charcoal/50">
                          {k} · <i className="font-serif italic not-italic text-charcoal/70 normal-case tracking-normal">{v}</i>
                        </span>
                      ))}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="h-7 w-7 rounded-full border border-[var(--hairline)] flex items-center justify-center text-charcoal"
                      >
                        <Icon name="minus" size={10} />
                      </button>
                      <span className="font-sans text-[13px] text-charcoal w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="h-7 w-7 rounded-full border border-[var(--hairline)] flex items-center justify-center text-charcoal"
                      >
                        <Icon name="plus" size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="swr-price-lg text-[18px]">
                      {formatINR(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      className="swr-meta text-charcoal/50 hover:text-oxide border-b border-[var(--hairline)]"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-[var(--hairline)] bg-cream-50 px-6 py-5 md:px-7 flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="swr-meta">Subtotal</span>
                <span className="swr-price-lg">{formatINR(subtotal)}</span>
              </div>
              <p className="font-sans text-[11px] text-charcoal/50">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <ButtonLink href="/cart" variant="primary" size="lg" block onClick={() => setOpen(false)}>
                Checkout
              </ButtonLink>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="swr-meta text-charcoal/65 hover:text-charcoal py-2"
              >
                Continue browsing
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
