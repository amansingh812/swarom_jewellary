/**
 * Centralized list of placeholder Unsplash photos used across the home page.
 * Swap these for real Swarom product / lifestyle photography when available.
 *
 * Each photo is sourced from Unsplash (free use under the Unsplash License).
 * Format: `https://images.unsplash.com/photo-{id}?w={w}&q=80&auto=format&fit=crop`
 */

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const PHOTOS = {
  // Hero — woman with rings on hand near lips/face. Warm tones.
  hero: u("1599643478518-a784e5dc4c8f", 1800),

  // Model wearing pendant on neck.
  pendantModel: u("1535632787350-4e68ef0ac584", 1200),

  // Hand wearing rings — closeup.
  ringModel: u("1611591437281-460bfbe1220a", 1200),

  // Wrist with bracelet.
  braceletModel: u("1611652022419-a9419f74343d", 1200),

  // Earring closeup on model.
  earringModel: u("1573408301185-9146fe634ad0", 1200),

  // Collection 1 — softer lifestyle shot (e.g. Birthday → Letters).
  collection1: u("1515562141207-7a88fb7ce338", 1200),

  // Collection 2 — softer lifestyle shot (e.g. Summer → Keepsake).
  collection2: u("1611085583191-a3b181a88401", 1200),

  // Must-have promo — big editorial.
  mustHave: u("1605100804763-247f67b3557e", 1600),

  // 4-image Instagram gallery.
  gallery: [
    u("1581605405669-fcdf81165afa", 800),
    u("1602751584552-8ba73aad10e1", 800),
    u("1620656798579-1984d9e87df7", 800),
    u("1611591437281-460bfbe1220a", 800),
  ],
};
