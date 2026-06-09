import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductTile } from "@/components/site/ProductTile";
import { ShopFilters } from "./ShopFilters";
import { getProducts } from "@/lib/products";
import { getWishlistProductIds } from "@/app/actions/wishlist";

interface ShopPageProps {
  searchParams: {
    cat?: string;
    sort?: string;
  };
}

export const metadata = {
  title: "Shop",
  description: "All Swarom pieces. Each one personalized — a name, a date, a small mark.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [products, wishlist] = await Promise.all([
    getProducts({ category: searchParams.cat ?? "all" }),
    getWishlistProductIds(),
  ]);

  return (
    <div className="mx-auto max-w-marketing px-5 pt-10 pb-16 md:px-10 md:pt-16 md:pb-24">
      <header className="flex flex-col items-center text-center gap-3 mb-8 md:mb-12">
        <Eyebrow withRule>Shop · All pieces</Eyebrow>
        <h1 className="swr-h1">The Collection</h1>
        <p className="swr-lede max-w-[560px] mt-1">
          Each piece personalized — a name, a date, a small mark.
        </p>
      </header>

      <ShopFilters active={searchParams.cat ?? "all"} sort={searchParams.sort ?? "newest"} />

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif italic text-[20px] text-charcoal/70">
            Nothing in this corner yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductTile key={p.id} product={p} inWishlist={wishlist.has(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
