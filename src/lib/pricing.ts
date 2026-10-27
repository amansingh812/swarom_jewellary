/**
 * Weight-based pricing for the gold line.
 *
 * Silver pieces carry a fixed `price`. Gold does not: the price is derived
 * from the day's rate and recomputed whenever a new rate is published.
 *
 *   metal value  = net weight × rate per gram
 *   wastage      = metal value × wastage %        (Indian retail convention)
 *   making       = per gram | % of metal | flat
 *   stones       = a flat figure you set per piece
 *   tax          = GST, applied separately to the metal side and to making
 *
 * The GST percentages default to 3% on metal and 5% on making charges and
 * are stored in `store_settings` so they can be changed without a deploy.
 * Confirm both against your own accountant before you go live — this file
 * does the arithmetic, it does not know your tax position.
 */

export type MetalKind =
  | "silver_925"
  | "gold_14k"
  | "gold_18k"
  | "gold_22k"
  | "gold_24k";

export type MakingChargeKind = "per_gram" | "percentage" | "flat";
export type PricingMode = "fixed" | "weight_based";

export const METAL_LABEL: Record<MetalKind, string> = {
  silver_925: "925 sterling silver",
  gold_14k: "14K gold",
  gold_18k: "18K gold",
  gold_22k: "22K gold",
  gold_24k: "24K gold",
};

/** Fineness in parts per thousand — what the piece is stamped with. */
export const METAL_FINENESS: Record<MetalKind, string> = {
  silver_925: "925",
  gold_14k: "585",
  gold_18k: "750",
  gold_22k: "916",
  gold_24k: "999",
};

export function isGold(metal: MetalKind): boolean {
  return metal.startsWith("gold_");
}

export interface PriceInputs {
  /** Grams of metal, excluding stones. */
  netWeight: number;
  /** Rupees per gram for this purity, from `metal_rates`. */
  ratePerGram: number;
  wastagePct?: number;
  makingChargeType?: MakingChargeKind;
  makingChargeValue?: number;
  /** Flat rupees for the stones in the piece. */
  stoneCharges?: number;
  gstPctJewellery?: number;
  gstPctMaking?: number;
  /** Round the final figure to the nearest N rupees. */
  roundTo?: number;
}

export interface PriceBreakdown {
  metalValue: number;
  wastage: number;
  making: number;
  stones: number;
  subtotal: number;
  tax: number;
  total: number;
}

export function computeGoldPrice(input: PriceInputs): PriceBreakdown {
  const netWeight = Math.max(0, input.netWeight || 0);
  const ratePerGram = Math.max(0, input.ratePerGram || 0);
  const wastagePct = Math.max(0, input.wastagePct ?? 0);
  const makingType = input.makingChargeType ?? "per_gram";
  const makingValue = Math.max(0, input.makingChargeValue ?? 0);
  const stones = Math.max(0, input.stoneCharges ?? 0);
  const gstJewellery = Math.max(0, input.gstPctJewellery ?? 3);
  const gstMaking = Math.max(0, input.gstPctMaking ?? 5);
  const roundTo = Math.max(1, input.roundTo ?? 1);

  const metalValue = netWeight * ratePerGram;
  const wastage = metalValue * (wastagePct / 100);

  let making = 0;
  if (makingType === "per_gram") making = netWeight * makingValue;
  else if (makingType === "percentage")
    making = (metalValue + wastage) * (makingValue / 100);
  else making = makingValue;

  const metalSide = metalValue + wastage + stones;
  const subtotal = metalSide + making;
  const tax = metalSide * (gstJewellery / 100) + making * (gstMaking / 100);
  const total = Math.round((subtotal + tax) / roundTo) * roundTo;

  return {
    metalValue: Math.round(metalValue),
    wastage: Math.round(wastage),
    making: Math.round(making),
    stones: Math.round(stones),
    subtotal: Math.round(subtotal),
    tax: Math.round(tax),
    total,
  };
}

/** A line-by-line breakdown for the product page's "how this price is built". */
export function breakdownRows(
  b: PriceBreakdown,
  opts: { netWeight: number; ratePerGram: number; wastagePct?: number }
): { label: string; value: number }[] {
  const rows = [
    {
      label: `Metal · ${opts.netWeight} g at ₹${opts.ratePerGram.toLocaleString("en-IN")}/g`,
      value: b.metalValue,
    },
  ];
  if (b.wastage > 0)
    rows.push({ label: `Wastage · ${opts.wastagePct ?? 0}%`, value: b.wastage });
  if (b.making > 0) rows.push({ label: "Making charges", value: b.making });
  if (b.stones > 0) rows.push({ label: "Stones", value: b.stones });
  rows.push({ label: "GST", value: b.tax });
  return rows;
}
