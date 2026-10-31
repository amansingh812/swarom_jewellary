"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
import { contactHref } from "@/lib/contact";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-charcoal/40 md:hidden animate-fadeup"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[360px] bg-cream md:hidden animate-slidein shadow-lift flex flex-col"
        role="dialog"
        aria-modal
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--hairline)]">
          <span className="font-serif text-[24px] text-charcoal">Swarom</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-charcoal"
          >
            <Icon name="close" size={14} />
          </button>
        </header>

        <nav className="flex flex-col gap-1 p-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="font-serif text-[28px] text-charcoal py-3 border-b border-[var(--hairline)] last:border-b-0 hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-5 border-t border-[var(--hairline)] flex flex-col gap-3">
          <Link
            href="/account"
            onClick={onClose}
            className="swr-meta text-charcoal flex items-center gap-2"
          >
            <Icon name="user" size={14} /> Account
          </Link>
          <Link
            href="/account/wishlist"
            onClick={onClose}
            className="swr-meta text-charcoal flex items-center gap-2"
          >
            <Icon name="heart" size={14} /> Wishlist
          </Link>
          <a
            href={contactHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="swr-meta text-charcoal flex items-center gap-2"
          >
            <Icon name="whatsapp" size={14} /> WhatsApp us
          </a>
          <ShimmerLine className="mt-4" />
          <p className="swr-meta text-charcoal/50">Bengaluru · Est. 2026</p>
        </div>
      </aside>
    </>
  );
}
