/**
 * Central site configuration.
 *
 * Single source of truth for brand identity, SEO tags, contact details,
 * location, and social links. Import from here instead of hardcoding
 * these values across the app.
 *
 * NOTE: All values below are DUMMY placeholders — replace before launch.
 */

export const siteConfig = {
  // --- Brand / identity ---
  name: "Shreeni",
  legalName: "Shreeni Sarees Pvt. Ltd.",
  tagline: "Timeless sarees, woven for every occasion",
  description:
    "Shop handpicked silk, cotton, and designer sarees online. Authentic weaves, elegant drapes, and fast delivery across India.",
  url: "https://www.shreeni.example.com",
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
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    supportHours: "Mon–Sat, 10:00 AM – 7:00 PM IST",
  },

  // --- Location ---
  location: {
    addressLine1: "123 Silk Market Road",
    addressLine2: "Gariahat",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700019",
    country: "India",
    countryCode: "IN",
    googleMapsUrl: "https://maps.google.com/?q=Shreeni+Sarees",
    geo: {
      latitude: 22.5186,
      longitude: 88.3639,
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
