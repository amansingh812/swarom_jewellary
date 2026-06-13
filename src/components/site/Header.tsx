"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/lib/cart/CartProvider";
import { MobileMenu } from "./MobileMenu";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/story", label: "Story" },
  { href: "/care", label: "Care" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setOpen: setBagOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ease-out ${
          scrolled
            ? "bg-cream/80 backdrop-blur-md border-b border-silver/30"
            : "bg-cream border-b border-transparent"
        }`}
      >
        {/* Announcement strip */}
        <div className="bg-charcoal text-cream">
          <div className="mx-auto flex max-w-marketing items-center justify-center gap-3 overflow-x-auto px-4 py-2 no-scrollbar sm:gap-4 sm:px-6">
            <span className="swr-meta whitespace-nowrap text-cream/90">
              Free shipping across India
            </span>
            <span aria-hidden className="text-gold-soft/60">·</span>
            <span className="swr-meta whitespace-nowrap text-cream/90">
              Made to order in Bengaluru
            </span>
            <span aria-hidden className="text-gold-soft/60 hidden sm:inline">·</span>
            <span className="swr-meta whitespace-nowrap text-cream/90 hidden sm:inline">
              30-day returns
            </span>
          </div>
        </div>

        {/* Main row */}
        <div className="mx-auto grid max-w-marketing grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 md:grid-cols-[1fr_auto_1fr] md:px-10 md:py-6">
          {/* Left: hamburger (mobile) / nav links (desktop) */}
          <div className="flex items-center md:gap-8">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-charcoal md:hidden"
            >
              <Icon name="menu" size={18} />
            </button>
            <nav className="hidden md:flex md:gap-8">
              {LINKS.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`swr-eyebrow pb-1 transition-colors duration-300 ${
                      active
                        ? "text-gold border-b border-gold"
                        : "text-charcoal-700 border-b border-transparent hover:text-gold"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: wordmark */}
          <Link
            href="/"
            className="font-serif text-[24px] uppercase leading-none tracking-widest text-charcoal md:text-[28px] mx-auto transition-all duration-500"
            aria-label="Swarom — Home"
          >
            Swarom
          </Link>

          {/* Right: icons */}
          <div className="flex items-center justify-end gap-3 md:gap-6">
            <Link
              href="/shop"
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center md:flex text-charcoal-700 transition-opacity duration-300 hover:opacity-70"
            >
              <Icon name="search" size={16} />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center md:flex text-charcoal-700 transition-opacity duration-300 hover:opacity-70"
            >
              <Icon name="user" size={16} />
            </Link>
            <button
              type="button"
              aria-label={`Bag — ${count} item${count === 1 ? "" : "s"}`}
              onClick={() => setBagOpen(true)}
              className="relative flex h-10 items-center justify-center gap-1.5 px-2 text-charcoal-700 transition-opacity duration-300 hover:opacity-70"
            >
              <Icon name="bag" size={18} />
              <span className="swr-meta text-gold">{count}</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={LINKS} />
    </>
  );
}
