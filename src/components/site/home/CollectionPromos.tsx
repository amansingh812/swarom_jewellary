import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PHOTOS } from "@/lib/photos";

interface PromoBlock {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  body: string;
}

const PROMOS: PromoBlock[] = [
  {
    href: "/shop?collection=letters",
    image: PHOTOS.collection1,
    eyebrow: "Must See New Style",
    title: "Letters",
    body: "Initials and names, drawn by hand and cast in sterling silver.",
  },
  {
    href: "/shop?collection=keepsake",
    image: PHOTOS.collection2,
    eyebrow: "New Collection",
    title: "Keepsake",
    body: "Small mementos for dates, places, and people worth keeping close.",
  },
];

/**
 * Two editorial collection blocks — borderless image with title and
 * gold text-link below, lookbook style. Second block offset on desktop.
 */
export function CollectionPromos() {
  return (
    <section className="mx-auto max-w-marketing px-6 py-16 md:px-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-12">
        {PROMOS.map((p, i) => (
          <Link
            key={p.href}
            href={p.href}
            className={`group flex flex-col ${i === 1 ? "md:mt-20" : ""}`}
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/4] overflow-hidden bg-cream-200 mb-7">
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover swr-zoom"
              />
            </div>
            <div className="flex flex-col items-start gap-3">
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h3 className="font-serif text-[26px] md:text-[32px] leading-[1.3] tracking-[0.02em] text-charcoal">
                The <i>{p.title}</i> Collection
              </h3>
              <p className="swr-lede max-w-md !text-[15px]">{p.body}</p>
              <span className="swr-eyebrow swr-underline-anim mt-1">
                Explore the collection
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
