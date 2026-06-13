import Link from "next/link";
import Image from "next/image";
import { PHOTOS } from "@/lib/photos";

const CATEGORIES = [
  { href: "/shop?cat=pendant", label: "Pendants", image: PHOTOS.pendantModel },
  { href: "/shop?cat=ring", label: "Rings", image: PHOTOS.ringModel },
  { href: "/shop?cat=bracelet", label: "Bracelets", image: PHOTOS.braceletModel },
  { href: "/shop?cat=anklet", label: "Anklets", image: PHOTOS.earringModel },
  { href: "/shop", label: "All Pieces", image: PHOTOS.mustHave },
];

/**
 * Row of circular category thumbnails with label-caps captions,
 * sitting between the hero and the best-sellers grid.
 */
export function CategoryCircles() {
  return (
    <section className="border-b border-silver/30 bg-cream">
      <div className="mx-auto flex max-w-marketing items-start justify-start gap-8 overflow-x-auto no-scrollbar px-6 py-10 md:justify-center md:gap-14 md:px-10 md:py-12">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex shrink-0 flex-col items-center gap-3"
          >
            <span className="relative h-16 w-16 overflow-hidden rounded-full border border-silver transition-colors duration-300 group-hover:border-gold-soft md:h-20 md:w-20">
              <Image
                src={c.image}
                alt=""
                fill
                sizes="80px"
                className="object-cover swr-zoom"
              />
            </span>
            <span className="swr-meta transition-colors duration-300 group-hover:text-gold">
              {c.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
