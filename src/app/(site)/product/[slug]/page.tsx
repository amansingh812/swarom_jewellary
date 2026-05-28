import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getProducts } from "@/lib/products";
import { ProductDetail } from "./ProductDetail";
import { ProductTile } from "@/components/site/ProductTile";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} ${product.modifier ?? ""}`.trim(),
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // Recommendations — just other products for now.
  const all = await getProducts({ limit: 5 });
  const recs = all.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-marketing px-5 pt-6 pb-32 md:px-10 md:pt-8 md:pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 swr-meta text-charcoal/50 border-b border-[var(--hairline)] py-3 mb-6 md:mb-8 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-charcoal whitespace-nowrap">Home</Link>
        <span aria-hidden>›</span>
        <Link href="/shop" className="hover:text-charcoal whitespace-nowrap">Shop</Link>
        <span aria-hidden>›</span>
        <span className="text-charcoal font-serif italic normal-case tracking-normal text-[13px] whitespace-nowrap">
          {product.name} {product.modifier && <i>{product.modifier}</i>}
        </span>
      </nav>

      <ProductDetail product={product} />

      {recs.length > 0 && (
        <section className="mt-20 md:mt-28">
          <div className="flex flex-col items-center gap-3 mb-8 md:mb-12">
            <Eyebrow withRule>You may also like</Eyebrow>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
            {recs.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
