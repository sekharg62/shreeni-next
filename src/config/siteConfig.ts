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
    "Shop handpicked silk, cotton, and designer sarees online. Authentic weaves, elegant drapes, and fast delivery across India.",
  url: env.siteUrl,
  apiBaseUrl: env.apiBaseUrl,
  locale: "en_IN",

  // --- SEO ---
  seo: {
    titleTemplate: "%s | Shreeni Sarees",
    defaultTitle: "Shreeni Sarees — Buy Silk, Cotton & Designer Sarees Online",
    keywords: [
      "sarees",
      "silk sarees",
      "cotton sarees",
      "designer sarees",
      "kanjivaram",
      "banarasi saree",
      "buy sarees online",
      "wedding sarees",
    ],
    ogImage: "/og-image.jpg",
    twitterHandle: "@shreeni",
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
