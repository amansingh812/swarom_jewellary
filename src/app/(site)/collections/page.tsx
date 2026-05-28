import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
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
    <div className="mx-auto max-w-marketing px-5 pt-12 pb-16 md:px-10 md:pt-20 md:pb-24">
      <header className="flex flex-col items-center text-center gap-3 mb-10 md:mb-16">
        <Eyebrow withRule>Collections</Eyebrow>
        <h1 className="swr-h1">Small, made-to-last assemblies.</h1>
        <p className="swr-lede max-w-[520px] mt-1">
          Four small collections. Each piece personalized — a name, a date, a
          small mark.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?collection=${c.slug}`}
            className="group flex flex-col gap-4"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-cream-200">
              <Image
                src={COVERS[c.slug] ?? "/products/pendant.svg"}
                alt={c.name}
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Eyebrow>The {c.name}</Eyebrow>
              <h2 className="swr-h2">
                <i>{c.name.toLowerCase()}</i>
              </h2>
              <p className="swr-lede max-w-md">{c.description}</p>
              <span className="swr-meta text-charcoal mt-2 inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                See pieces <Icon name="arrow-right" size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
