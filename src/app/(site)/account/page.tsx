import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Account" };

export default function AccountOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card
        title="Your orders"
        href="/account/orders"
        body="Track shipments, view receipts, request a return."
      />
      <Card
        title="Your wishlist"
        href="/account/wishlist"
        body="Pieces you've saved for later. We'll let you know if anything moves."
      />
      <Card
        title="Your addresses"
        href="/account/addresses"
        body="Save addresses so checkout is one tap."
      />
    </div>
  );
}

function Card({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8 hover:border-charcoal/40 transition-colors"
    >
      <Eyebrow>{title}</Eyebrow>
      <p className="swr-body">{body}</p>
      <span className="swr-meta text-charcoal mt-2 inline-flex items-center gap-2 group-hover:gap-3 transition-all">
        Open <Icon name="arrow-right" size={12} />
      </span>
    </Link>
  );
}
