/**
 * Brand and placeholder imagery.
 *
 * Product photographs live in Cloudinary and are delivered through the
 * next/image custom loader, which appends `f_auto,q_auto,w_<width>` per
 * breakpoint. The URLs below are stored plain — never add a transformation
 * segment by hand, the loader does it.
 *
 * The Unsplash stills are still placeholders for the social gallery and
 * should go when real photography replaces them.
 */

const CLOUD = "https://res.cloudinary.com/drygcfes5/image/upload";

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const PHOTOS = {
  // ── Swarom's own, on Cloudinary ────────────────────────────
  hero: `${CLOUD}/v1793116164/swarom/brand/hero-model.png`,
  pendant: `${CLOUD}/v1793116158/swarom/products/real-pendant.jpg`,
  ring: `${CLOUD}/v1793116160/swarom/products/real-ring.jpg`,
  bracelet: `${CLOUD}/v1793116161/swarom/products/real-bracelet.jpg`,
  anklet: `${CLOUD}/v1793116162/swarom/products/real-anklet.jpg`,

  // ── placeholders, pending real photography ─────────────────
  pendantModel: u("1535632787350-4e68ef0ac584", 1200),
  ringModel: u("1611591437281-460bfbe1220a", 1200),
  braceletModel: u("1611652022419-a9419f74343d", 1200),
  earringModel: u("1573408301185-9146fe634ad0", 1200),
  collection1: u("1515562141207-7a88fb7ce338", 1200),
  collection2: u("1611085583191-a3b181a88401", 1200),
  mustHave: u("1605100804763-247f67b3557e", 1600),
  gallery: [
    u("1581605405669-fcdf81165afa", 800),
    u("1602751584552-8ba73aad10e1", 800),
    u("1620656798579-1984d9e87df7", 800),
    u("1611591437281-460bfbe1220a", 800),
  ],
};
