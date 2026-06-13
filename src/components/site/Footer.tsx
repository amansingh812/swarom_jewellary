"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await subscribeNewsletter(email, "footer");
      if (res.ok) {
        setDone(true);
        setEmail("");
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <footer className="bg-charcoal text-cream relative z-[2]">
      <div className="mx-auto max-w-marketing grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[4fr_8fr] md:gap-16 md:px-20 md:py-20">
        {/* Brand block */}
        <div className="flex flex-col">
          <div className="font-serif text-[28px] uppercase tracking-widest leading-none text-cream">
            Swarom
          </div>
          <p className="font-serif italic text-[17px] leading-relaxed mt-4 max-w-[300px] text-cream/70">
            Personalized 925 sterling silver, handcrafted in Bengaluru.
          </p>
          <div className="mt-6 h-px w-24 bg-gold-soft/60" aria-hidden />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          <FooterCol label="Shop">
            <FooterLink href="/shop">All pieces</FooterLink>
            <FooterLink href="/shop?cat=pendant">Pendants</FooterLink>
            <FooterLink href="/shop?cat=ring">Rings</FooterLink>
            <FooterLink href="/shop?cat=bracelet">Bracelets</FooterLink>
            <FooterLink href="/shop?cat=anklet">Anklets</FooterLink>
          </FooterCol>
          <FooterCol label="Help">
            <FooterLink href="/care">Care guide</FooterLink>
            <FooterLink href="/shipping">Shipping</FooterLink>
            <FooterLink href="/returns">Returns</FooterLink>
            <FooterLink href="/sizing">Sizing</FooterLink>
          </FooterCol>
          <FooterCol label="Reach">
            <FooterLink href="https://wa.me/919999999999" external>
              <Icon name="whatsapp" size={12} /> WhatsApp
            </FooterLink>
            <FooterLink href="https://instagram.com/swarom.in" external>
              <Icon name="instagram" size={12} /> Instagram
            </FooterLink>
            <FooterLink href="mailto:hello@swarom.in" external>
              <Icon name="mail" size={12} /> hello@swarom.in
            </FooterLink>
          </FooterCol>
          <FooterCol label="Newsletter">
            <p className="font-sans text-[13px] leading-relaxed text-cream/60 mb-3 max-w-[220px]">
              One quiet letter each month. New pieces, behind the bench.
            </p>
            {done ? (
              <p className="swr-meta !text-gold-soft">You&apos;re on the list.</p>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={onSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={pending}
                  className="border-b border-cream/30 bg-transparent px-0 py-2.5 font-sans text-[13px] text-cream placeholder:text-cream/40 outline-none focus:border-gold-soft disabled:opacity-50 transition-colors"
                  aria-label="Email"
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="self-start font-sans text-[11px] font-semibold uppercase tracking-widest text-gold-soft swr-underline-anim disabled:opacity-50"
                >
                  {pending ? "Adding…" : "Subscribe"}
                </button>
                {error && <p className="swr-meta !text-[#FFB4AB]">{error}</p>}
              </form>
            )}
          </FooterCol>
        </div>
      </div>

      <div className="mx-auto max-w-marketing flex flex-col gap-3 px-6 py-6 border-t border-cream/15 md:flex-row md:items-center md:justify-between md:px-20">
        <span className="swr-meta !text-cream/50">© 2026 Swarom</span>
        <span className="swr-meta !text-cream/50">Bengaluru · Est. 2026</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="swr-meta !text-cream/50 hover:!text-gold-soft transition-colors">
            Privacy
          </Link>
          <span aria-hidden className="text-cream/30">·</span>
          <Link href="/terms" className="swr-meta !text-cream/50 hover:!text-gold-soft transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-gold-soft mb-2">
        {label}
      </span>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "font-sans text-[13px] text-cream/65 hover:text-gold-soft flex items-center gap-2 transition-colors duration-300";
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
