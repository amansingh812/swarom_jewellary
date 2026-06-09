import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { PHOTOS } from "@/lib/photos";

/**
 * 4-up Instagram-style lifestyle collage. Each square links to the Swarom
 * Instagram so the social proof loop completes.
 */
export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-marketing px-5 py-14 md:px-10 md:py-20">
      <div className="flex flex-col items-center gap-3 mb-8 md:mb-12">
        <Eyebrow withRule>On Instagram</Eyebrow>
        <h2 className="swr-h2 italic text-center">@swarom.in</h2>
        <p className="swr-lede max-w-[440px] text-center">
          Photographs from our customers. Tag us when you wear yours.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {PHOTOS.gallery.map((src, i) => (
          <a
            key={i}
            href="https://instagram.com/swarom.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-md bg-cream-200"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
              <Icon
                name="instagram"
                size={20}
                className="text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
