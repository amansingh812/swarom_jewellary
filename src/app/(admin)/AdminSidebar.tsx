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
    <aside className="border-b md:border-b-0 md:border-r border-[var(--hairline)] bg-cream-50 md:min-h-screen">
      <div className="px-5 py-5 md:px-7 md:py-8 flex items-center justify-between md:flex-col md:items-start md:gap-6">
        <Link href="/admin" className="font-serif text-[24px] text-charcoal">
          Swarom
          <span className="font-sans text-[10px] tracking-widest text-charcoal/50 ml-2 align-middle">
            ADMIN
          </span>
        </Link>
        <Link href="/" className="swr-meta text-charcoal/55 hover:text-charcoal">
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
              className={`flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2.5 font-sans text-[12px] tracking-wider uppercase transition-colors ${
                active
                  ? "bg-charcoal text-cream"
                  : "text-charcoal/65 hover:text-charcoal hover:bg-cream-200"
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
