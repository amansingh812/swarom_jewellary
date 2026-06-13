import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  let orders: {
    id: string;
    created_at: string;
    status: string;
    total: number;
  }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("orders")
      .select("id, created_at, status, total")
      .order("created_at", { ascending: false });
    orders = data ?? [];
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <Eyebrow>Orders</Eyebrow>
        <p className="font-serif italic text-[20px] text-charcoal/70">
          No orders yet.
        </p>
        <p className="swr-lede max-w-[420px]">
          When you place your first piece, you&apos;ll find it here — with a
          live status from the bench.
        </p>
        <Link
          href="/shop"
          className="swr-meta text-charcoal border-b border-[var(--hairline)] inline-flex items-center gap-2 self-start mt-2 py-2 hover:border-charcoal"
        >
          Browse pieces <Icon name="arrow-right" size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Eyebrow>Orders</Eyebrow>
      <ul className="m-0 p-0 list-none flex flex-col gap-3">
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-6 grid grid-cols-[1fr_auto] gap-4 items-center"
          >
            <div className="flex flex-col gap-1">
              <span className="font-sans tracking-wider text-[12px] text-charcoal/55">
                #{o.id.slice(0, 8)}
              </span>
              <span className="font-serif text-[16px] text-charcoal">
                {new Date(o.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="swr-meta text-charcoal/55">{o.status}</span>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="swr-price-lg">{formatINR(o.total)}</span>
              <Link
                href={`/account/orders/${o.id}`}
                className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
