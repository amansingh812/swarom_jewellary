import Link from "next/link";
import Image from "next/image";
import { ArchFrame, SectionHeading } from "@/components/ui/Ornament";
import { PHOTOS } from "@/lib/photos";

const CATEGORIES = [
  { href: "/shop?cat=pendant", label: "Pendants", image: PHOTOS.pendant },
  { href: "/shop?cat=ring", label: "Rings", image: PHOTOS.ring },
  { href: "/shop?cat=bracelet", label: "Bracelets", image: PHOTOS.bracelet },
  { href: "/shop?cat=anklet", label: "Anklets", image: PHOTOS.anklet },
  { href: "/shop?cat=for-two", label: "For Two", image: PHOTOS.pendant },
];

/**
 * Shop-by-piece row. Each category sits inside the pointed arch, which is
 * what carries the brand's Indian register across the storefront.
 */
export function CategoryArches() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-marketing px-6 py-16 md:px-10 md:py-24 lg:px-20">
        <SectionHeading
          eyebrow="Shop by piece"
          title="What would you like engraved?"
          className="mb-12"
        />

        <ul className="m-0 grid list-none grid-cols-2 gap-5 p-0 md:grid-cols-5 md:gap-6">
          {CATEGORIES.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="group flex flex-col items-center gap-4">
                <ArchFrame className="aspect-[3/4] w-full">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 45vw, 200px"
                    className="object-cover swr-zoom"
                  />
                </ArchFrame>
                <span className="font-serif text-[16px] text-charcoal transition-colors duration-300 group-hover:text-gold md:text-[17px]">
                  {c.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
