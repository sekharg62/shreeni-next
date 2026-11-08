import type { MetadataRoute } from "next";
import { getSitemapCatalog } from "@/lib/data/catalog";
import { absoluteUrl } from "@/lib/seo";

/**
 * sitemap.xml — every public, indexable page: home, info pages, every category and every product
 * (with its photo, for Google Images). Private pages (account, checkout, wishlist) and redirects are left out.
 * Google ignores changefreq/priority, so only real signals are sent.
 */
const STATIC_PAGES = [
  "/",
  "/sarees",
  "/about/story",
  "/about/craftsmanship",
  "/contact/help",
  "/contact/stores",
  "/contact/whatsapp",
  "/faqs",
  "/shipping",
  "/returns",
  "/track",
  "/privacy",
  "/terms",
];

/** Next.js writes sitemap values verbatim, so `&` in image URLs (e.g. CDN query strings) must be escaped or the XML is invalid. */
const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products } = await getSitemapCatalog();
  return [
    ...STATIC_PAGES.map((path) => ({ url: xml(absoluteUrl(path)) })),
    ...categories.map((slug) => ({ url: xml(absoluteUrl(`/sarees/${slug}`)) })),
    ...products.map((p) => ({
      url: xml(absoluteUrl(`/products/${p.slug}`)),
      ...(p.image && { images: [xml(p.image)] }),
    })),
  ];
}
