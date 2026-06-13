import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { COLLECTIONS } from "@/lib/products";

export const metadata = {
  title: "Collections",
  description: "Four small, made-to-last collections.",
};

const COVERS: Record<string, string> = {
  everyday: "/products/pendant.svg",
  letters: "/products/bracelet.svg",
  "for-two": "/products/ring.svg",
  keepsake: "/products/pendant.svg",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-marketing px-6 pt-14 pb-section-gap md:px-20 md:pt-24">
      <header className="flex flex-col items-center text-center gap-5 mb-16 md:mb-28 max-w-3xl mx-auto">
        <Eyebrow withRule>The Maison</Eyebrow>
        <h1 className="swr-display">Curated Collections</h1>
        <p className="swr-lede">
          Four small collections, each held to the same standard: personalized
          with a name, a date, a small mark — and made to outlast the moment
          it remembers.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-x-12 md:gap-y-28">
        {COLLECTIONS.map((c, i) => {
          const overlay = i % 2 === 0;
          return (
            <Link
              key={c.slug}
              href={`/shop?collection=${c.slug}`}
              className={`group flex flex-col ${i % 2 === 1 ? "md:mt-24" : ""}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
                <Image
                  src={COVERS[c.slug] ?? "/products/pendant.svg"}
                  alt={c.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover swr-zoom"
                />
                {overlay && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-7 pt-20 flex flex-col items-start gap-2">
                    <h2 className="font-serif text-[26px] md:text-[30px] leading-[1.3] tracking-[0.02em] text-cream m-0">
                      The {c.name}
                    </h2>
                    <p className="font-sans text-[13px] leading-relaxed text-cream/80 max-w-sm m-0">
                      {c.description}
                    </p>
                    <span className="swr-eyebrow !text-gold-soft swr-underline-anim mt-2">
                      Explore the collection
                    </span>
                  </div>
                )}
              </div>
              {!overlay && (
                <div className="flex flex-col items-start gap-3 pt-7">
                  <h2 className="font-serif text-[26px] md:text-[30px] leading-[1.3] tracking-[0.02em] text-charcoal m-0">
                    The {c.name}
                  </h2>
                  <p className="swr-lede !text-[15px] max-w-md m-0">{c.description}</p>
                  <span className="swr-eyebrow swr-underline-anim mt-1">
                    Explore the collection
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
