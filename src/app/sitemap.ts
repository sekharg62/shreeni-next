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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products } = await getSitemapCatalog();
  return [
    ...STATIC_PAGES.map((path) => ({ url: absoluteUrl(path) })),
    ...categories.map((slug) => ({ url: absoluteUrl(`/sarees/${slug}`) })),
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      ...(p.image && { images: [p.image] }),
    })),
  ];
}
