import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { formatINR } from "@/lib/money";

export default async function AdminProductsPage() {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  let products: {
    id: string;
    slug: string;
    name: string;
    modifier: string | null;
    price: number;
    status: string;
    category: string;
  }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select("id, slug, name, modifier, price, status, category")
      .order("created_at", { ascending: false });
    products = data ?? [];
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <Eyebrow>Products</Eyebrow>
          <h1 className="swr-h1 mt-2">The catalogue</h1>
        </div>
        <ButtonLink href="/admin/products/new" variant="primary">
          + New piece
        </ButtonLink>
      </header>

      {products.length === 0 ? (
        <Empty />
      ) : (
        <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[var(--hairline)]">
              <tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>&nbsp;</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[var(--hairline)] last:border-b-0">
                  <Td>
                    <Link href={`/admin/products/${p.id}`} className="font-serif text-[15px] hover:text-gold">
                      {p.name}{" "}
                      {p.modifier && <i className="font-normal text-charcoal/65">{p.modifier}</i>}
                    </Link>
                  </Td>
                  <Td>
                    <span className="swr-meta">{p.category}</span>
                  </Td>
                  <Td>
                    <span className="swr-price">{formatINR(p.price)}</span>
                  </Td>
                  <Td>
                    <span
                      className={`swr-meta rounded-pill px-2 py-1 ${
                        p.status === "active"
                          ? "bg-moss/10 text-moss"
                          : "bg-charcoal/5 text-charcoal/55"
                      }`}
                    >
                      {p.status}
                    </span>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
                    >
                      Edit
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--hairline-strong)] bg-cream-50 p-10 text-center flex flex-col gap-3 items-center">
      <p className="font-serif italic text-[20px] text-charcoal/70">
        No pieces in the catalogue yet.
      </p>
      <p className="swr-lede max-w-[420px]">
        Run <code>supabase/seed.sql</code> to load the starter set, or add a
        piece by hand.
      </p>
      <ButtonLink href="/admin/products/new" variant="primary" className="mt-2">
        + New piece
      </ButtonLink>
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
  return <td className="px-4 md:px-5 py-3 align-middle">{children}</td>;
}
