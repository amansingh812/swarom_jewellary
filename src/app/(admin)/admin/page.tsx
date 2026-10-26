import { Eyebrow } from "@/components/ui/Eyebrow";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  let stats = { products: 0, orders: 0, customers: 0, revenue: 0 };
  let recentOrders: { id: string; created_at: string; total: number; status: string }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    type OrderRow = { id: string; created_at: string; total: number; status: string };
    // Revenue counts every order that actually earned money — not just the
    // five shown below, and never a cancelled or refunded one.
    const EARNED = ["paid", "in_production", "shipped", "delivered"];

    const [
      { count: productCount },
      { count: orderCount },
      { count: customerCount },
      ordersRes,
      earnedRes,
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id, created_at, total, status")
        .order("created_at", { ascending: false })
        .limit(5)
        .returns<OrderRow[]>(),
      supabase
        .from("orders")
        .select("total")
        .in("status", EARNED)
        .returns<{ total: number }[]>(),
    ]);

    const orders = ordersRes.data ?? [];
    stats = {
      products: productCount ?? 0,
      orders: orderCount ?? 0,
      customers: customerCount ?? 0,
      revenue: (earnedRes.data ?? []).reduce((s, o) => s + (o.total ?? 0), 0),
    };
    recentOrders = orders;
  }

  return (
    <div className="flex flex-col gap-10">
      <header>
        <Eyebrow>Dashboard</Eyebrow>
        <h1 className="swr-h1 mt-3">
          <i>Today at the bench.</i>
        </h1>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Products" value={stats.products.toString()} />
        <StatCard label="Orders" value={stats.orders.toString()} />
        <StatCard label="Customers" value={stats.customers.toString()} />
        <StatCard label="Revenue" value={`₹ ${stats.revenue.toLocaleString("en-IN")}`} />
      </section>

      <section>
        <Eyebrow>Recent orders</Eyebrow>
        <div className="mt-4 rounded-xl border border-[var(--hairline)] bg-cream-50 divide-y divide-[var(--hairline)]">
          {recentOrders.length === 0 ? (
            <p className="p-6 font-serif italic text-charcoal/65">No orders yet.</p>
          ) : (
            recentOrders.map((o) => (
              <div key={o.id} className="p-4 md:p-5 grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-charcoal/55">#{o.id.slice(0, 8)}</div>
                  <div className="font-serif text-[15px] text-charcoal mt-0.5">
                    {new Date(o.created_at).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="swr-price">₹ {o.total.toLocaleString("en-IN")}</div>
                  <div className="swr-meta text-charcoal/55">{o.status}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Note>
        Revenue counts orders marked paid, in production, shipped or delivered.
        Pending, cancelled and refunded orders are excluded.
      </Note>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--hairline)] border-t-2 border-t-gold-soft bg-cream-50 p-5">
      <div className="swr-meta text-charcoal/55 mb-1">{label}</div>
      <div className="swr-price-lg">{value}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-xl border border-dashed border-[var(--hairline-strong)] bg-cream p-5 md:p-6 font-sans text-[13px] leading-relaxed text-charcoal/70">
      {children}
    </aside>
  );
}
