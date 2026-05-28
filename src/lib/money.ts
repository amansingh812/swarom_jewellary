/** Format paise / rupees in Indian locale, with the ₹ glyph and thin spacing. */
export function formatINR(amount: number): string {
  if (Number.isNaN(amount)) return "₹ 0";
  return `₹ ${Math.round(amount).toLocaleString("en-IN")}`;
}

/** Convert rupees → paise (Razorpay's smallest unit). */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
