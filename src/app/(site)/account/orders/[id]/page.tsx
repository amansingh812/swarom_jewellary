import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { formatINR } from "@/lib/money";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/server";
import type { Order, OrderItem } from "@/lib/supabase/types";

interface PageProps {
  params: { id: string };
}

export const metadata = { title: "Order" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending payment",
  paid: "Payment received",
  in_production: "At the bench",
  shipped: "On its way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STATUS_ORDER = ["pending", "paid", "in_production", "shipped", "delivered"];

export default async function OrderDetailPage({ params }: PageProps) {
  await requireUser(`/account/orders/${params.id}`);

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-4">
        <Eyebrow>Order</Eyebrow>
        <p className="swr-lede">Order #{params.id.slice(0, 8)} — orders aren&apos;t live until Supabase is connected.</p>
      </div>
    );
  }

  const supabase = createServerSupabaseClient();
  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", params.id).single<Order>(),
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", params.id)
      .returns<OrderItem[]>(),
  ]);

  if (!order) notFound();

  const stepIndex = STATUS_ORDER.indexOf(order.status);
  const ship = (order.shipping_address ?? {}) as {
    full_name?: string;
    phone?: string;
    line1?: string;
    line2?: string | null;
    city?: string;
    state?: string;
    pincode?: string;
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link href="/account/orders" className="swr-meta text-charcoal/55 hover:text-charcoal inline-flex items-center gap-2 self-start">
          <Icon name="arrow-right" size={10} className="rotate-180" /> Back to orders
        </Link>
        <Eyebrow>Order #{order.id.slice(0, 8)}</Eyebrow>
        <h1 className="swr-h1">
          <i>{STATUS_LABELS[order.status] ?? order.status}</i>
        </h1>
        <p className="swr-meta text-charcoal/55">
          Placed {new Date(order.created_at).toLocaleString("en-IN", {
            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </header>

      {/* Status timeline */}
      {stepIndex >= 0 && (
        <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8">
          <div className="grid grid-cols-5 gap-2">
            {STATUS_ORDER.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${i <= stepIndex ? "bg-gold" : "bg-[var(--hairline-strong)]"}`} />
                <span className={`text-center font-sans text-[10px] tracking-wider uppercase ${
                  i <= stepIndex ? "text-charcoal" : "text-charcoal/35"
                }`}>
                  {STATUS_LABELS[step].split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-8">
        <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
          <Eyebrow>Pieces</Eyebrow>
          <ul className="m-0 mt-4 p-0 list-none flex flex-col">
            {(items ?? []).map((it) => (
              <li key={it.id} className="grid grid-cols-[56px_1fr_auto] gap-4 py-4 border-b border-[var(--hairline)] last:border-b-0 items-center">
                <div className="w-14 h-16 rounded-md overflow-hidden bg-cream-200">
                  {it.image && <Image src={it.image} alt="" width={56} height={64} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <div className="font-serif font-medium text-[15px] text-charcoal">
                    {it.name}{" "}
                    {it.modifier && <i className="font-normal text-charcoal/65">{it.modifier}</i>}
                  </div>
                  {it.options && typeof it.options === "object" && (
                    <div className="flex flex-wrap gap-x-3 mt-1">
                      {Object.entries(it.options as Record<string, string>).map(([k, v]) => (
                        <span key={k} className="swr-meta text-charcoal/55">
                          {k} · <i className="font-serif italic text-charcoal/70 normal-case tracking-normal">{v}</i>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="font-sans tracking-wider text-[11px] text-charcoal/50 mt-1">× {it.quantity}</div>
                </div>
                <div className="swr-price whitespace-nowrap">
                  {formatINR(it.unit_price * it.quantity)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
            <Eyebrow>Summary</Eyebrow>
            <div className="mt-4 flex flex-col gap-2">
              <Row label="Subtotal" value={formatINR(order.subtotal)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatINR(order.shipping)} />
              {order.tax > 0 && <Row label="Tax" value={formatINR(order.tax)} />}
              <div className="h-px bg-[var(--hairline)] my-2" />
              <Row label="Total" value={formatINR(order.total)} large />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
            <Eyebrow>Shipping to</Eyebrow>
            <p className="font-sans text-[13px] text-charcoal/80 leading-relaxed mt-3">
              {ship.full_name}<br />
              {ship.line1}{ship.line2 ? `, ${ship.line2}` : ""}<br />
              {ship.city}, {ship.state} {ship.pincode}<br />
              {ship.phone}
            </p>
          </div>

          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Swarom, about order #${order.id.slice(0, 8)} —`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="swr-meta text-charcoal border-b border-[var(--hairline)] inline-flex items-center gap-2 self-start hover:border-charcoal"
          >
            <Icon name="whatsapp" size={12} /> Ask about this order
          </a>
        </aside>
      </section>
    </div>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={large ? "swr-eyebrow text-charcoal" : "swr-meta"}>{label}</span>
      <span className={large ? "swr-price-lg" : "swr-price"}>{value}</span>
    </div>
  );
}
