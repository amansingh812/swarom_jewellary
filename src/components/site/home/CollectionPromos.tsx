import Link from "next/link";
import Image from "next/image";
import { ArchFrame, SectionHeading } from "@/components/ui/Ornament";
import { PHOTOS } from "@/lib/photos";

interface Promo {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  body: string;
}

const PROMOS: Promo[] = [
  {
    href: "/shop?collection=letters",
    image: PHOTOS.pendant,
    eyebrow: "Collection 02",
    title: "Letters",
    body: "One letter, cast in silver, traced in your handwriting. Devanagari, Tamil, Telugu or Latin.",
  },
  {
    href: "/shop?collection=keepsake",
    image: PHOTOS.anklet,
    eyebrow: "Collection 04",
    title: "Keepsake",
    body: "Pieces that open, that hold, that carry. The ones that get put away and taken out again.",
  },
];

/** Two collections, framed in the arch — the same device the hero uses. */
export function CollectionPromos() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-marketing px-6 py-16 md:px-10 md:py-24 lg:px-20">
        <SectionHeading
          eyebrow="The collections"
          title="Four small collections"
          className="mb-12"
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-12 p-0 md:grid-cols-2 md:gap-14">
          {PROMOS.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="group flex flex-col items-center gap-6 text-center">
                <ArchFrame className="aspect-[3/4] w-full max-w-[380px]">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 90vw, 380px"
                    className="object-cover swr-zoom"
                  />
                </ArchFrame>
                <div className="flex flex-col items-center gap-3">
                  <span className="swr-eyebrow">{p.eyebrow}</span>
                  <h3 className="font-serif text-[26px] leading-[1.25] text-charcoal transition-colors duration-300 group-hover:text-gold md:text-[30px]">
                    {p.title}
                  </h3>
                  <p className="swr-lede max-w-[360px] !text-[14px]">{p.body}</p>
                  <span className="swr-eyebrow swr-underline-anim mt-1 text-gold">
                    Explore
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
