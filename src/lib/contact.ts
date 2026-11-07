import { siteConfig } from "@/config/siteConfig";

const digits = (phone: string) => phone.replace(/\D/g, "");

/** "tel:+919748594143" */
export const telHref = (phone: string = siteConfig.contact.phone) => `tel:+${digits(phone)}`;

/** WhatsApp chat link (opens the app on phones, WhatsApp Web on desktop), optionally with a message typed in. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${digits(siteConfig.contact.whatsapp)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** One-line postal address. */
export function fullAddress(): string {
  const l = siteConfig.location;
  return `${l.addressLine1}, ${l.addressLine2}, ${l.city}, ${l.state} ${l.postalCode}, ${l.country}`;
}
