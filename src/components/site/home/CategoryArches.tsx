import Link from "next/link";
import Image from "next/image";
import { ArchFrame } from "@/components/ui/Ornament";

const CATEGORIES = [
  { href: "/shop?cat=pendant", label: "Pendants", image: "/products/real-pendant.png" },
  { href: "/shop?cat=ring", label: "Rings", image: "/products/real-ring.png" },
  { href: "/shop?cat=bracelet", label: "Bracelets", image: "/products/real-bracelet.png" },
  { href: "/shop?cat=anklet", label: "Anklets", image: "/products/real-anklet.png" },
  { href: "/shop?cat=for-two", label: "For Two", image: "/products/real-pendant.png" },
];

/**
 * Shop-by-piece row. Each category sits inside the pointed arch, which is
 * what carries the brand's Indian register across the storefront.
 */
export function CategoryArches() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-marketing px-6 py-16 md:px-10 md:py-24 lg:px-20">
        <div className="mb-12 text-center">
          <p className="swr-eyebrow mb-3.5">Shop by piece</p>
          <h2 className="font-serif text-[30px] leading-[1.2] text-charcoal md:text-[40px]">
            What would you like engraved?
          </h2>
        </div>

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
