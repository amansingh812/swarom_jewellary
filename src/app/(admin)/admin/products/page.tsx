import Link from "next/link";
import Image from "next/image";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { formatINR } from "@/lib/money";

const PAGE_SIZE = 20;

const STATUSES = ["active", "draft", "archived"] as const;
const CATEGORIES = ["pendant", "ring", "bracelet", "anklet", "for-two"] as const;

interface Row {
  id: string;
  slug: string;
  name: string;
  modifier: string | null;
  price: number;
  status: string;
  category: string;
  image_main: string | null;
}

interface PageProps {
  searchParams: { q?: string; status?: string; cat?: string; page?: string };
}

/** PostgREST `or()` takes a comma-separated filter list — strip what breaks it. */
function safeSearch(q: string) {
  return q.replace(/[,()%*\\]/g, " ").trim().slice(0, 60);
}

function hrefWith(
  current: PageProps["searchParams"],
  patch: Record<string, string | undefined>
) {
  const sp = new URLSearchParams();
  const merged = { ...current, ...patch };
  for (const [k, v] of Object.entries(merged)) {
    if (v) sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `/admin/products?${s}` : "/admin/products";
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const q = safeSearch(searchParams.q ?? "");
  const status = STATUSES.includes(searchParams.status as (typeof STATUSES)[number])
    ? searchParams.status
    : undefined;
  const cat = CATEGORIES.includes(searchParams.cat as (typeof CATEGORIES)[number])
    ? searchParams.cat
    : undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);

  let products: Row[] = [];
  let total = 0;

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("products")
      .select("id, slug, name, modifier, price, status, category, image_main", {
        count: "exact",
      })
      .order("created_at", { ascending: false });

    if (q) query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%,modifier.ilike.%${q}%`);
    if (status) query = query.eq("status", status);
    if (cat) query = query.eq("category", cat);

    const from = (page - 1) * PAGE_SIZE;
    const { data, count } = await query.range(from, from + PAGE_SIZE - 1).returns<Row[]>();
    products = data ?? [];
    total = count ?? 0;
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(q || status || cat);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Products</Eyebrow>
          <h1 className="swr-h1 mt-2">The catalogue</h1>
        </div>
        <ButtonLink href="/admin/products/new" variant="primary">
          + New piece
        </ButtonLink>
      </header>

      {/* filters — a plain GET form, so it works without JS */}
      <form
        method="get"
        action="/admin/products"
        className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-4 md:p-5 flex flex-wrap items-end gap-3"
      >
        <label className="flex flex-col gap-1.5 flex-grow min-w-[200px]">
          <span className="swr-meta text-charcoal">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Name, slug or modifier"
            className="rounded-lg bg-cream border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="swr-meta text-charcoal">Status</span>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-lg bg-cream border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="swr-meta text-charcoal">Category</span>
          <select
            name="cat"
            defaultValue={cat ?? ""}
            className="rounded-lg bg-cream border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-lg border border-charcoal bg-charcoal px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-widest text-cream hover:bg-charcoal-800"
        >
          Filter
        </button>

        {filtered && (
          <Link href="/admin/products" className="swr-meta text-charcoal/60 pb-3 hover:text-charcoal">
            Clear
          </Link>
        )}
      </form>

      <p className="swr-meta text-charcoal/55">
        {total} {total === 1 ? "piece" : "pieces"}
        {filtered ? " match" : " in the catalogue"}
      </p>

      {products.length === 0 ? (
        <Empty filtered={filtered} />
      ) : (
        <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[var(--hairline)]">
              <tr>
                <Th>
                  <span className="sr-only">Photograph</span>
                </Th>
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
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="block h-14 w-11 overflow-hidden rounded-[3px] border border-[var(--hairline)] bg-cream-200"
                    >
                      {p.image_main ? (
                        <Image
                          src={p.image_main}
                          alt=""
                          width={44}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[9px] text-charcoal/40">
                          —
                        </span>
                      )}
                    </Link>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-serif text-[15px] hover:text-gold"
                    >
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

      {pages > 1 && (
        <nav className="flex items-center justify-between gap-4" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={hrefWith(searchParams, { page: String(page - 1) })}
              className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="swr-meta text-charcoal/55">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={hrefWith(searchParams, { page: String(page + 1) })}
              className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}

function Empty({ filtered }: { filtered: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--hairline-strong)] bg-cream-50 p-10 text-center flex flex-col gap-3 items-center">
      <p className="font-serif italic text-[20px] text-charcoal/70">
        {filtered ? "Nothing matches those filters." : "No pieces in the catalogue yet."}
      </p>
      {filtered ? (
        <Link href="/admin/products" className="swr-meta text-charcoal border-b border-gold">
          Clear the filters
        </Link>
      ) : (
        <ButtonLink href="/admin/products/new" variant="primary" className="mt-2">
          + New piece
        </ButtonLink>
      )}
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
