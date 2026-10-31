/**
 * Where enquiries go.
 *
 * The number lives in the environment, not in the source, so it can be
 * changed without a code edit. Set NEXT_PUBLIC_WHATSAPP_NUMBER in
 * .env.local and in the Vercel project settings — digits only, with the
 * country code and no "+" (an Indian mobile looks like 9198XXXXXXXX).
 *
 * If it is unset, the enquiry controls fall back to email rather than
 * dialling a placeholder number that belongs to a stranger.
 */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@swarom.in";

export function hasWhatsApp(): boolean {
  return /^\d{10,15}$/.test(WHATSAPP_NUMBER);
}

/** A ready-to-use enquiry link for one piece — WhatsApp if configured, else email. */
export function enquiryHref(pieceName: string): string {
  const subject = `Enquiry: ${pieceName}`;
  const body = `Hi Swarom, I'd like to ask about "${pieceName}" — price, weight and availability.`;
  return hasWhatsApp()
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`
    : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
}

export function enquiryLabel(): string {
  return hasWhatsApp() ? "Enquire on WhatsApp" : "Enquire by email";
}

/** A general contact link — WhatsApp if configured, otherwise email. */
export function contactHref(message?: string): string {
  const body = message ?? "Hi Swarom,";
  return hasWhatsApp()
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`
    : `mailto:${CONTACT_EMAIL}?body=${encodeURIComponent(body)}`;
}

/** Label for a general contact control. */
export function contactLabel(): string {
  return hasWhatsApp() ? "WhatsApp" : "Email us";
}
