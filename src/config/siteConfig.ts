/**
 * Central site configuration.
 *
 * Single source of truth for brand identity, SEO tags, contact details,
 * location, and social links. Import from here instead of hardcoding
 * these values across the app.
 *
 * NOTE: All values below are DUMMY placeholders — replace before launch.
 */

import { env } from "./env";

export const siteConfig = {
  // --- Brand / identity ---
  name: "Shreeni",
  legalName: "Shreeni Sarees Pvt. Ltd.",
  tagline: "Timeless sarees, woven for every occasion",
  description:
    "Shop handwoven Bengal sarees online — Baluchori, Jamdani, Tant, Kantha and pure silks, chosen from weavers across Bengal. Delivered across India.",
  url: env.siteUrl,
  apiBaseUrl: env.apiBaseUrl,
  locale: "en_IN",

  // --- SEO ---
  seo: {
    titleTemplate: "%s | Shreeni Sarees",
    defaultTitle: "Shreeni Sarees — Handwoven Bengal Sarees Online",
    keywords: [
      "sarees",
      "buy sarees online",
      "handloom sarees",
      "Bengal sarees",
      "Baluchori saree",
      "Swarnachori saree",
      "Jamdani saree",
      "Tant saree",
      "Kantha stitch saree",
      "Murshidabad silk saree",
      "Bishnupuri silk saree",
      "silk sarees",
      "wedding sarees",
    ],
    /** Optional: Google Search Console verification token (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION). */
    googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  // --- Launch ---
  launch: {
    /**
     * Pre-launch preview: shows the "launching soon" strip and locks "Place order".
     * The site stays indexable for SEO. Set NEXT_PUBLIC_PREVIEW_MODE=false on launch day.
     */
    preview: process.env.NEXT_PUBLIC_PREVIEW_MODE !== "false",
    message: "We're launching soon! Shreeni is in preview — browse freely, orders open shortly.",
  },

  // --- Analytics ---
  analytics: {
    /** Google Tag Manager container. Override with NEXT_PUBLIC_GTM_ID; set it to "" to turn tracking off. */
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TBLCPRBT",
  },

  // --- Contact info ---
  contact: {
    email: "support@shreeni.example.com",
    salesEmail: "sales@shreeni.example.com",
    phone: "+91 97485 94143",
    whatsapp: "+91 97485 94143",
    supportHours: "Mon–Sat, 10:00 AM – 7:00 PM IST",
  },

  // --- Location ---
  location: {
    addressLine1: "14/8/A, Chowdhuri Para Street",
    addressLine2: "Chowdhuri Para, Near Doltala",
    city: "Halisahar",
    state: "West Bengal",
    postalCode: "743134",
    country: "India",
    countryCode: "IN",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=14%2F8%2FA+Chowdhuri+Para+Street%2C+Halisahar%2C+West+Bengal+743134",
    // Approximate (Halisahar town centre) — replace with the shop's exact pin from Google Maps.
    geo: {
      latitude: 22.9483,
      longitude: 88.4189,
    },
  },

  // --- Social links ---
  social: {
    instagram: "https://instagram.com/shreeni",
    facebook: "https://facebook.com/shreeni",
    youtube: "https://youtube.com/@shreeni",
    pinterest: "https://pinterest.com/shreeni",
    x: "https://x.com/shreeni",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export default siteConfig;
