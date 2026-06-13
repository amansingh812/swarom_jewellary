import Link from "next/link";
import { ProductTile } from "@/components/site/ProductTile";
import { ShopFilters } from "./ShopFilters";
import { getProducts } from "@/lib/products";
import { getWishlistProductIds } from "@/app/actions/wishlist";
import { Icon } from "@/components/ui/Icon";

interface ShopPageProps {
  searchParams: {
    cat?: string;
    sort?: string;
    collection?: string;
  };
}

export const metadata = {
  title: "Shop",
  description: "All Swarom pieces. Each one personalized — a name, a date, a small mark.",
};

/* Staggered lookbook offsets, repeating every 3 tiles on xl. */
const STAGGER = ["", "md:mt-12 xl:mt-0", "xl:mt-12"];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [fetched, wishlist] = await Promise.all([
    getProducts({
      category: searchParams.cat ?? "all",
      collection: searchParams.collection,
    }),
    getWishlistProductIds(),
  ]);

  const sort = searchParams.sort ?? "newest";
  const products = [...fetched].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0; // newest — already ordered by created_at desc
  });

  return (
    <div className="mx-auto max-w-marketing px-6 pt-12 pb-section-gap md:px-20 md:pt-20">
      <header className="flex flex-col items-center text-center gap-5 mb-14 md:mb-24 max-w-3xl mx-auto">
        <h1 className="swr-display !text-gold">The Collection</h1>
        <p className="swr-lede">
          Discover our personalized 925 sterling silver pieces — each one
          carrying a name, a date, a small mark. Made to order in Bengaluru,
          made to be as enduring as what it remembers.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Filters — sidebar on desktop, horizontal strip on mobile */}
        <aside className="w-full lg:w-64 flex-shrink-0 mb-10 lg:mb-0">
          <ShopFilters active={searchParams.cat ?? "all"} sort={sort} />
        </aside>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="flex-grow py-24 text-center">
            <p className="font-serif italic text-[22px] text-charcoal-700">
              Nothing in this corner yet.
            </p>
          </div>
        ) : (
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((p, i) => (
              <div key={p.id} className={STAGGER[i % 3]}>
                <ProductTile product={p} inWishlist={wishlist.has(p.id)} />
              </div>
            ))}

            {/* Bespoke promo tile — asymmetric insertion, per the design */}
            <div className="col-span-1 sm:col-span-2 xl:col-span-1 flex items-center justify-center p-8 bg-cream-100 border border-silver/30 aspect-auto sm:aspect-[8/5] xl:aspect-[4/5]">
              <div className="text-center space-y-5 max-w-sm py-10 sm:py-0">
                <span className="inline-flex text-gold" aria-hidden>
                  <Icon name="stamp" size={32} />
                </span>
                <h3 className="font-serif text-[26px] leading-[1.3] tracking-[0.02em] text-gold m-0">
                  Bespoke Creations
                </h3>
                <p className="swr-lede !text-[15px] m-0">
                  Commission a piece as unique as your own story. Tell us a
                  name, a date, a word — we&apos;ll sketch it by hand.
                </p>
                <Link
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block swr-eyebrow border-b border-gold pb-1 hover:opacity-70 transition-opacity"
                >
                  Inquire Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
