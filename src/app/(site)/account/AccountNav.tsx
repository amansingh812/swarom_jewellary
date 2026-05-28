"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-visible">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap py-2 px-3 md:px-0 rounded-md md:rounded-none font-sans text-[12px] tracking-wider uppercase transition-colors ${
              active
                ? "text-gold md:bg-transparent bg-cream-200"
                : "text-charcoal/65 hover:text-charcoal"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
