import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Crawl everything public; keep account, checkout and other per-shopper pages out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/checkout", "/wishlist"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
