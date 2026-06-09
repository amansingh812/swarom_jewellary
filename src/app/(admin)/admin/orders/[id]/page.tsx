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
import { requireAdmin } from "@/lib/auth/server";
import { OrderStatusEditor, OrderNotesEditor } from "./Editors";
import type { Order, OrderItem } from "@/lib/supabase/types";

export const metadata = { title: "Order · admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  if (!isSupabaseConfigured()) {
    return <p className="swr-lede">Configure Supabase to view orders.</p>;
  }

  const supabase = createServerSupabaseClient();
  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", params.id).single<Order>(),
    supabase.from("order_items").select("*").eq("order_id", params.id).returns<OrderItem[]>(),
  ]);
  if (!order) notFound();

  const ship = (order.shipping_address ?? {}) as Record<string, string | undefined>;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/orders" className="swr-meta text-charcoal/55 hover:text-charcoal inline-flex items-center gap-2 self-start">
        <Icon name="arrow-right" size={10} className="rotate-180" /> All orders
      </Link>

      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <Eyebrow>Order</Eyebrow>
          <h1 className="swr-h1 mt-1 font-mono text-[28px]">#{order.id.slice(0, 8)}</h1>
          <p className="swr-meta text-charcoal/55 mt-2">
            {new Date(order.created_at).toLocaleString("en-IN")}
          </p>
        </div>
        <OrderStatusEditor orderId={order.id} current={order.status} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-6">
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
            <Eyebrow>Pieces</Eyebrow>
            <ul className="m-0 mt-4 p-0 list-none">
              {(items ?? []).map((it) => (
                <li key={it.id} className="grid grid-cols-[56px_1fr_auto] gap-3 py-3 border-b border-[var(--hairline)] last:border-b-0 items-center">
                  <div className="w-14 h-16 rounded-md overflow-hidden bg-cream-200">
                    {it.image && <Image src={it.image} alt="" width={56} height={64} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif text-[15px] text-charcoal">
                      {it.name}{" "}
                      {it.modifier && <i className="font-normal text-charcoal/65">{it.modifier}</i>}
                    </div>
                    {it.options && typeof it.options === "object" && (
                      <div className="flex flex-wrap gap-x-3 mt-1">
                        {Object.entries(it.options as Record<string, string>).map(([k, v]) => (
                          <span key={k} className="swr-meta text-charcoal/55">
                            {k} · <i className="font-serif italic normal-case tracking-normal text-charcoal/75">{v}</i>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="font-mono text-[10px] text-charcoal/50 mt-1">× {it.quantity}</div>
                  </div>
                  <div className="swr-price whitespace-nowrap">
                    {formatINR(it.unit_price * it.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-[var(--hairline)] mt-4 pt-4 flex flex-col gap-2">
              <Row label="Subtotal" value={formatINR(order.subtotal)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatINR(order.shipping)} />
              {order.tax > 0 && <Row label="Tax" value={formatINR(order.tax)} />}
              <Row label="Total" value={formatINR(order.total)} large />
            </div>
          </section>

          <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
            <Eyebrow>Internal notes</Eyebrow>
            <p className="font-sans text-[12px] text-charcoal/55 mt-1 mb-3">
              Visible to admins only. Use for bench-side reminders.
            </p>
            <OrderNotesEditor orderId={order.id} initial={order.notes ?? ""} />
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
            <Eyebrow>Customer</Eyebrow>
            <p className="font-sans text-[14px] text-charcoal/85 mt-3">
              <strong>{ship.full_name}</strong><br />
              {order.email}<br />
              {order.phone}
            </p>
          </section>

          <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
            <Eyebrow>Shipping</Eyebrow>
            <p className="font-sans text-[14px] text-charcoal/85 mt-3 leading-relaxed">
              {ship.line1}{ship.line2 ? `, ${ship.line2}` : ""}<br />
              {ship.city}, {ship.state} {ship.pincode}<br />
              {ship.country ?? "India"}
            </p>
          </section>

          <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7">
            <Eyebrow>Payment</Eyebrow>
            <p className="font-sans text-[13px] text-charcoal/70 mt-3">
              {order.razorpay_payment_id
                ? <>Razorpay: <span className="font-mono text-[11px]">{order.razorpay_payment_id}</span></>
                : <span className="italic">No payment record yet.</span>}
            </p>
          </section>

          <a
            href={`https://wa.me/${(order.phone ?? "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${ship.full_name ?? ""}, about your Swarom order #${order.id.slice(0, 8)} —`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="swr-meta text-charcoal border-b border-[var(--hairline)] inline-flex items-center gap-2 self-start hover:border-charcoal"
          >
            <Icon name="whatsapp" size={12} /> WhatsApp the customer
          </a>
        </aside>
      </div>
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
