"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconName } from "@/components/ui/Icon";

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Dashboard", icon: "sparkle" },
  { href: "/admin/products", label: "Products", icon: "stamp" },
  { href: "/admin/orders", label: "Orders", icon: "truck" },
  { href: "/admin/customers", label: "Customers", icon: "user" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "mail" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-b md:border-b-0 md:border-r border-charcoal-800 bg-charcoal text-cream md:min-h-screen">
      <div className="px-5 py-5 md:px-7 md:py-8 flex items-center justify-between md:flex-col md:items-start md:gap-6">
        <Link
          href="/admin"
          className="font-serif text-[20px] uppercase tracking-widest text-cream"
        >
          Swarom
          <span className="font-sans text-[9px] font-semibold tracking-[0.25em] text-gold-soft ml-2 align-middle">
            Atelier
          </span>
        </Link>
        <Link
          href="/"
          className="swr-meta !text-cream/50 hover:!text-gold-soft transition-colors"
        >
          ← Site
        </Link>
      </div>

      <nav className="flex md:flex-col overflow-x-auto no-scrollbar px-3 md:px-4 pb-3 md:pb-0 gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 whitespace-nowrap border-l-2 px-3 py-2.5 font-sans text-[12px] tracking-wider uppercase transition-colors ${
                active
                  ? "border-gold-soft bg-charcoal-800 text-gold-soft"
                  : "border-transparent text-cream/60 hover:text-cream hover:bg-charcoal-800"
              }`}
            >
              <Icon name={l.icon} size={14} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
