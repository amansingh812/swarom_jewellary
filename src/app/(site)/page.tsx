import { getProducts } from "@/lib/products";
import { getWishlistProductIds } from "@/app/actions/wishlist";
import { Hero } from "@/components/site/home/Hero";
import { TrustStrip } from "@/components/site/home/TrustStrip";
import { CategoryArches } from "@/components/site/home/CategoryArches";
import { EngravingFeature } from "@/components/site/home/EngravingFeature";
import { TopProductsTabs } from "@/components/site/home/TopProductsTabs";
import { NewArrivalsStrip } from "@/components/site/home/NewArrivalsStrip";
import { CollectionPromos } from "@/components/site/home/CollectionPromos";
import { SubBanner } from "@/components/site/home/SubBanner";
import { PriceTiers } from "@/components/site/home/PriceTiers";
import { InstagramGallery } from "@/components/site/home/InstagramGallery";
import { NewsletterBlock } from "@/components/site/home/NewsletterBlock";

/**
 * Home, in the order the design sets out:
 *
 *   hero → proof → what we make → how it's personalised → the catalogue
 *   → one dark beat → collections → an editorial break → gifting → social
 *
 * The dark New Arrivals band is the page's only high-contrast moment and is
 * what stops the cream running flat from top to bottom.
 */
export default async function HomePage() {
  const [all, newArrivals, wishlist] = await Promise.all([
    getProducts(),
    getProducts({ limit: 3 }),
    getWishlistProductIds(),
  ]);

  return (
    <div className="flex flex-col">
      <Hero />
      <TrustStrip />
      <CategoryArches />
      <EngravingFeature />
      <TopProductsTabs products={all} />
      <NewArrivalsStrip products={newArrivals} wishlist={wishlist} />
      <CollectionPromos />
      <SubBanner />
      <PriceTiers />
      <InstagramGallery />
      <NewsletterBlock />
    </div>
  );
}
