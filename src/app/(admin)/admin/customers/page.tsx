import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default async function AdminCustomersPage() {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  let customers: { id: string; full_name: string | null; phone: string | null; role: string; created_at: string }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role, created_at")
      .order("created_at", { ascending: false });
    customers = data ?? [];
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Eyebrow>Customers</Eyebrow>
        <h1 className="swr-h1 mt-2">The names</h1>
      </header>

      <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 overflow-x-auto">
        {customers.length === 0 ? (
          <p className="p-8 font-serif italic text-charcoal/65 text-center">No customers yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-[var(--hairline)]">
              <tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Role</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-[var(--hairline)] last:border-b-0 hover:bg-cream-200/40 transition-colors">
                  <Td>
                    <Link href={`/admin/customers/${c.id}`} className="hover:text-gold">
                      {c.full_name || <span className="text-charcoal/40 italic">no name</span>}
                    </Link>
                  </Td>
                  <Td>{c.phone || "—"}</Td>
                  <Td>
                    <span className={`swr-meta rounded-pill px-2 py-1 ${c.role === "admin" ? "bg-gold/15 text-charcoal" : "bg-cream-200"}`}>
                      {c.role}
                    </span>
                  </Td>
                  <Td>
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
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
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 md:px-5 py-3 align-middle font-sans text-[14px]">{children}</td>;
}
