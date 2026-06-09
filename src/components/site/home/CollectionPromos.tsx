import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { PHOTOS } from "@/lib/photos";

interface PromoBlock {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  italic?: boolean;
}

const PROMOS: PromoBlock[] = [
  {
    href: "/shop?collection=letters",
    image: PHOTOS.collection1,
    eyebrow: "Must See New Style",
    title: "Letters",
    italic: true,
  },
  {
    href: "/shop?collection=keepsake",
    image: PHOTOS.collection2,
    eyebrow: "New Collection",
    title: "Keepsake",
    italic: true,
  },
];

/**
 * Two large collection promo blocks side-by-side (stacked on mobile),
 * each with a lifestyle photo and a small overlay card with eyebrow + title + CTA.
 */
export function CollectionPromos() {
  return (
    <section className="mx-auto max-w-marketing px-5 py-14 md:px-10 md:py-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {PROMOS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group relative block overflow-hidden rounded-xl bg-cream-200 aspect-[4/5] sm:aspect-[5/4]"
          >
            <Image
              src={p.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Soft cream wash on the right so the overlay card has contrast */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-l from-cream/70 via-cream/10 to-transparent"
            />

            {/* Overlay card — bottom-center on mobile, right-center on desktop */}
            <div className="absolute inset-0 flex items-end md:items-center md:justify-end">
              <div className="m-4 md:m-8 lg:m-10 bg-cream rounded-xl shadow-card p-5 md:p-7 flex flex-col items-start gap-3 max-w-[260px]">
                <Eyebrow>{p.eyebrow}</Eyebrow>
                <h3 className="font-serif text-[24px] md:text-[32px] leading-none text-charcoal">
                  {p.italic ? (
                    <i>The {p.title}</i>
                  ) : (
                    <>The {p.title}</>
                  )}{" "}
                  <span className="font-normal text-charcoal/65">Collection</span>
                </h3>
                <span className="swr-meta text-charcoal inline-flex items-center gap-2 mt-1 group-hover:gap-3 transition-all">
                  Shop now <Icon name="arrow-right" size={10} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
