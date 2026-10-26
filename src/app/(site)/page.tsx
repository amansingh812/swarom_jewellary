import { getProducts } from "@/lib/products";
import { getWishlistProductIds } from "@/app/actions/wishlist";
import { Hero } from "@/components/site/home/Hero";
import { CategoryArches } from "@/components/site/home/CategoryArches";
import { TopProductsTabs } from "@/components/site/home/TopProductsTabs";
import { NewArrivalsStrip } from "@/components/site/home/NewArrivalsStrip";
import { CollectionPromos } from "@/components/site/home/CollectionPromos";
import { MustHavePromo } from "@/components/site/home/MustHavePromo";
import { TrustStrip } from "@/components/site/home/TrustStrip";
import { InstagramGallery } from "@/components/site/home/InstagramGallery";
import { NewsletterBlock } from "@/components/site/home/NewsletterBlock";

export default async function HomePage() {
  // Fetch everything in parallel.
  const [all, newArrivals, wishlist] = await Promise.all([
    getProducts(),                          // for the tabbed top-products section
    getProducts({ limit: 3 }),              // newest 3 for the New Arrivals strip
    getWishlistProductIds(),
  ]);

  return (
    <div className="flex flex-col">
      <Hero />
      <CategoryArches />
      <TopProductsTabs products={all} />
      <NewArrivalsStrip products={newArrivals} wishlist={wishlist} />
      <CollectionPromos />
      <MustHavePromo />
      <TrustStrip />
      <InstagramGallery />
      <NewsletterBlock />
    </div>
  );
}
