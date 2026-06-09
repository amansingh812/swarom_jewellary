"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
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
    <footer className="bg-cream-200 border-t border-[var(--hairline)] relative z-[2]">
      <div className="mx-auto max-w-marketing grid grid-cols-1 gap-10 px-5 py-12 md:grid-cols-[4fr_8fr] md:gap-16 md:px-10 md:py-16">
        {/* Brand block */}
        <div className="flex flex-col">
          <div className="font-serif text-[36px] leading-none text-charcoal">Swarom</div>
          <p className="swr-tagline mt-3 max-w-[280px]">
            Personalized 925 sterling silver, handcrafted in Bengaluru.
          </p>
          <ShimmerLine className="mt-4" />
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
            <p className="font-sans text-[12px] leading-relaxed text-charcoal/65 mb-2 max-w-[220px]">
              One quiet letter each month. New pieces, behind the bench.
            </p>
            {done ? (
              <p className="swr-meta text-moss">You&apos;re on the list.</p>
            ) : (
              <form className="flex flex-col gap-2" onSubmit={onSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={pending}
                  className="rounded-pill border border-[var(--hairline)] bg-cream-50 px-4 py-2.5 font-sans text-[12px] text-charcoal placeholder:text-charcoal/40 outline-none focus:border-charcoal disabled:opacity-50"
                  aria-label="Email"
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-pill bg-charcoal px-4 py-2.5 font-sans text-[11px] font-medium tracking-wider text-cream hover:bg-charcoal-800 disabled:opacity-50"
                >
                  {pending ? "Adding…" : "Notify me"}
                </button>
                {error && <p className="swr-meta text-oxide">{error}</p>}
              </form>
            )}
          </FooterCol>
        </div>
      </div>

      <div className="mx-auto max-w-marketing flex flex-col gap-3 px-5 py-5 border-t border-[var(--hairline)] md:flex-row md:items-center md:justify-between md:px-10">
        <span className="swr-meta">© 2026 Swarom</span>
        <span className="swr-hairline-rule swr-meta">
          <em className="not-italic">Bengaluru · Est. 2026</em>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="swr-meta hover:text-charcoal">Privacy</Link>
          <span aria-hidden className="text-charcoal/30">·</span>
          <Link href="/terms" className="swr-meta hover:text-charcoal">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-charcoal mb-1">
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
    "font-sans text-[13px] text-charcoal/65 hover:text-charcoal flex items-center gap-2 transition-colors";
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
