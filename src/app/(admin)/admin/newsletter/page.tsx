import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default async function AdminNewsletterPage() {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  let subs: { id: string; email: string; source: string | null; created_at: string }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("newsletter")
      .select("id, email, source, created_at")
      .order("created_at", { ascending: false });
    subs = data ?? [];
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-baseline justify-between">
        <div>
          <Eyebrow>Newsletter</Eyebrow>
          <h1 className="swr-h1 mt-2">{subs.length} on the list</h1>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(
            "email,source,joined\n" + subs.map((s) => `${s.email},${s.source ?? ""},${s.created_at}`).join("\n")
          )}`}
          download="swarom-newsletter.csv"
          className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
        >
          Export CSV
        </a>
      </header>

      <div className="rounded-xl border border-[var(--hairline)] bg-cream-50">
        {subs.length === 0 ? (
          <p className="p-8 font-serif italic text-charcoal/65 text-center">No subscribers yet.</p>
        ) : (
          <ul className="m-0 p-0 list-none divide-y divide-[var(--hairline)]">
            {subs.map((s) => (
              <li key={s.id} className="px-5 py-3 flex items-center justify-between">
                <span className="font-mono text-[13px] text-charcoal">{s.email}</span>
                <span className="swr-meta text-charcoal/50">
                  {new Date(s.created_at).toLocaleDateString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
