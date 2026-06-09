import { notFound } from "next/navigation";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { formatINR } from "@/lib/money";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";
import type { Profile, Order } from "@/lib/supabase/types";

export const metadata = { title: "Customer · admin" };

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  if (!isSupabaseConfigured()) {
    return <p className="swr-lede">Configure Supabase to view customers.</p>;
  }

  const supabase = createServerSupabaseClient();
  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", params.id).single<Profile>(),
    supabase
      .from("orders")
      .select("id, created_at, status, total")
      .eq("user_id", params.id)
      .order("created_at", { ascending: false })
      .returns<{ id: string; created_at: string; status: string; total: number }[]>(),
  ]);

  if (!profile) notFound();

  const lifetime = (orders ?? []).reduce((s, o) => s + o.total, 0);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/customers" className="swr-meta text-charcoal/55 hover:text-charcoal inline-flex items-center gap-2 self-start">
        <Icon name="arrow-right" size={10} className="rotate-180" /> All customers
      </Link>

      <header className="flex flex-col gap-2">
        <Eyebrow>Customer</Eyebrow>
        <h1 className="swr-h1">
          {profile.full_name || <span className="font-serif italic text-charcoal/60">no name</span>}
        </h1>
        <p className="swr-meta text-charcoal/55">
          Joined {new Date(profile.created_at).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Orders" value={(orders ?? []).length.toString()} />
        <Stat label="Lifetime value" value={`₹ ${lifetime.toLocaleString("en-IN")}`} />
        <Stat label="Role" value={profile.role} />
        <Stat label="Phone" value={profile.phone || "—"} />
      </section>

      <section className="rounded-xl border border-[var(--hairline)] bg-cream-50">
        <div className="px-5 py-4 border-b border-[var(--hairline)]">
          <Eyebrow>Orders</Eyebrow>
        </div>
        {(orders ?? []).length === 0 ? (
          <p className="p-6 font-serif italic text-charcoal/55 text-center">No orders yet.</p>
        ) : (
          <ul className="m-0 p-0 list-none divide-y divide-[var(--hairline)]">
            {(orders ?? []).map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="grid grid-cols-[1fr_auto_auto] gap-3 items-center px-5 py-4 hover:bg-cream-200 transition-colors"
                >
                  <div>
                    <div className="font-mono text-[12px] text-charcoal/55">#{o.id.slice(0, 8)}</div>
                    <div className="font-serif text-[14px] text-charcoal mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <span className="swr-meta rounded-pill bg-cream-200 px-2 py-1">{o.status}</span>
                  <span className="swr-price">{formatINR(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-4">
      <div className="swr-meta text-charcoal/55 mb-1">{label}</div>
      <div className="swr-price-lg text-[18px]">{value}</div>
    </div>
  );
}
