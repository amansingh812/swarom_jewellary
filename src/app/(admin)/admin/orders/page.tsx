import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatINR } from "@/lib/money";

export default async function AdminOrdersPage() {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  let orders: {
    id: string;
    created_at: string;
    email: string;
    status: string;
    total: number;
  }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("orders")
      .select("id, created_at, email, status, total")
      .order("created_at", { ascending: false });
    orders = data ?? [];
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Eyebrow>Orders</Eyebrow>
        <h1 className="swr-h1 mt-2">From the bench</h1>
      </header>

      <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 overflow-x-auto">
        {orders.length === 0 ? (
          <p className="p-8 font-serif italic text-charcoal/65 text-center">No orders yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-[var(--hairline)]">
              <tr>
                <Th>#</Th>
                <Th>Email</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Total</Th>
                <Th>&nbsp;</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[var(--hairline)] last:border-b-0">
                  <Td className="font-mono text-[12px] text-charcoal/55">
                    {o.id.slice(0, 8)}
                  </Td>
                  <Td>{o.email}</Td>
                  <Td>
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Td>
                  <Td>
                    <span className="swr-meta rounded-pill bg-cream-200 px-2 py-1">{o.status}</span>
                  </Td>
                  <Td>
                    <span className="swr-price">{formatINR(o.total)}</span>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
                    >
                      View
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 md:px-5 py-3 font-sans text-[10px] tracking-widest uppercase text-charcoal/55 font-medium">
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 md:px-5 py-3 align-middle font-sans text-[14px] ${className}`}>{children}</td>;
}
