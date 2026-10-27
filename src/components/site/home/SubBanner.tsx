import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { JaaliPanel } from "@/components/ui/Ornament";
import { PHOTOS } from "@/lib/photos";

/**
 * Full-width editorial break between the catalogue and the gifting blocks.
 * Photograph on one side, a single collection claim on the other.
 */
export function SubBanner() {
  return (
    <section className="bg-cream-200">
      <div className="mx-auto flex max-w-marketing flex-wrap items-stretch">
        <div className="relative min-h-[380px] min-w-0 flex-[1_1_420px] overflow-hidden bg-cream-200 md:min-h-[460px]">
          <Image
            src={PHOTOS.hero}
            alt="The Everyday pendant, worn"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[50%_26%]"
          />
        </div>

        <div className="relative flex min-w-0 flex-[999_1_420px] flex-col justify-center overflow-hidden bg-cream-50 px-7 py-14 md:px-16 md:py-20">
          <JaaliPanel className="-bottom-8 -right-8 h-[220px] w-[220px]" opacity={0.14} />
          <div className="relative">
            <p className="swr-eyebrow mb-4">The Everyday</p>
            <h2 className="max-w-[380px] font-serif text-[28px] leading-[1.2] text-charcoal md:text-[36px]">
              Worn on a Tuesday. Kept for forty years.
            </h2>
            <p className="swr-lede mt-5 max-w-[400px]">
              Thin chains, light bands, nothing that catches. Made to be put on in
              the morning and forgotten until someone asks about them.
            </p>
            <div className="mt-8">
              <ButtonLink href="/collections" variant="primary" size="lg">
                See the collection
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
