import Image from "next/image";
import Link from "next/link";
import { AmbientOrbs } from "@/components/site/AmbientOrbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { ProductTile } from "@/components/site/ProductTile";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts({ limit: 4 });

  return (
    <div className="relative overflow-hidden">
      <AmbientOrbs />

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-marketing px-5 pt-12 pb-16 md:grid md:grid-cols-[5fr_7fr] md:items-center md:gap-16 md:px-10 md:pt-20 md:pb-24">
        {/* Mobile: hero image first */}
        <div className="md:hidden mb-8">
          <HeroArt />
        </div>

        <div className="flex flex-col">
          <Eyebrow withRule className="mb-6">The Everyday Collection</Eyebrow>
          <h1 className="swr-display">
            Elegance Is a Way Of<br className="hidden md:inline" />{" "}
            Expression And<br className="hidden md:inline" />{" "}
            It Lasts Longer Than Life
          </h1>
          <div className="swr-signature mt-3 md:mt-4" style={{ fontSize: "clamp(56px, 9vw, 110px)" }}>
            Swarom
          </div>
          <p className="swr-lede max-w-md mt-6 md:mt-8">
            Personalized 925 sterling silver jewellery, handcrafted in Bengaluru.
            Made to order. Made to last.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="primary" size="lg">
              Shop the collection
            </ButtonLink>
            <ButtonLink href="/story" variant="secondary" size="lg">
              Read our story <Icon name="arrow-right" size={14} />
            </ButtonLink>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-2 max-w-sm">
            <TrustPill icon="stamp" label="925 Silver" />
            <TrustPill icon="heart" label="Personalized" />
            <TrustPill icon="leaf" label="Made to order" />
          </div>
        </div>

        {/* Desktop: hero image right */}
        <div className="hidden md:block">
          <HeroArt />
        </div>
      </section>

      {/* ─── 3-step feature band ──────────────────────────── */}
      <section className="border-y border-[var(--hairline)] relative z-[1] bg-cream">
        <div className="mx-auto max-w-marketing grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-[var(--hairline)]">
          <FeatureStep num="01" label="Sketch">
            Tell us a name, a date, a feeling. We sketch by hand.
          </FeatureStep>
          <FeatureStep num="02" label="Cast" border>
            Hand-cast in 925 sterling silver in our Bengaluru studio.
          </FeatureStep>
          <FeatureStep num="03" label="Send" border>
            Polished, packaged, and on its way within 10 days.
          </FeatureStep>
        </div>
      </section>

      {/* ─── Product grid ─────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-marketing px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col items-center gap-3 mb-10 md:mb-14">
          <Eyebrow withRule>The Collection</Eyebrow>
          <h2 className="swr-h2 text-center">A small, made-to-last assembly.</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-10">
          {products.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/shop" variant="secondary" size="lg">
            See all pieces <Icon name="arrow-right" size={14} />
          </ButtonLink>
        </div>
      </section>

      {/* ─── Story strip ──────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-marketing grid grid-cols-1 gap-8 px-5 py-16 md:grid-cols-2 md:items-center md:gap-16 md:px-10 md:py-24">
        <div className="rounded-xl overflow-hidden bg-cream-200 aspect-[4/3] md:aspect-square">
          <Image
            src="/products/bracelet.svg"
            alt=""
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 max-w-lg">
          <Eyebrow withRule>Behind the bench</Eyebrow>
          <h2 className="swr-h2">Hand-finished, one piece at a time.</h2>
          <p className="swr-lede">
            Every Swarom piece passes through one set of hands from sketch to send-off.
            We use the same 925 alloy you&apos;d find in heirlooms, and we hallmark each
            piece with the date it was made.
          </p>
          <div>
            <ButtonLink href="/story" variant="link">
              Read our story <Icon name="arrow-right" size={12} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative aspect-[4/3.4]">
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-cream-200">
        <Image
          src="/products/hero-still-life.svg"
          alt=""
          width={1000}
          height={850}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="absolute -bottom-6 -right-3 md:-bottom-8 md:-right-5 w-32 md:w-60 rounded-lg overflow-hidden shadow-lift bg-cream">
        <Image
          src="/products/pendant.svg"
          alt=""
          width={400}
          height={500}
          className="w-full block"
        />
      </div>
    </div>
  );
}

function TrustPill({ icon, label }: { icon: "stamp" | "heart" | "leaf"; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-charcoal/60">
      <Icon name={icon} size={16} />
      <span className="font-sans text-[10px] font-medium uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function FeatureStep({
  num,
  label,
  children,
  border,
}: {
  num: string;
  label: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`p-8 md:p-10 ${
        border ? "border-t md:border-t-0 border-[var(--hairline)]" : ""
      }`}
    >
      <span className="font-script text-gold text-[48px] md:text-[56px] leading-none block">
        {num}
      </span>
      <span className="font-sans text-[11px] uppercase tracking-widest text-charcoal/80 block mt-2 mb-3">
        {label}
      </span>
      <p className="font-sans text-[14px] leading-relaxed text-charcoal/65 max-w-[280px] m-0">
        {children}
      </p>
    </div>
  );
}
