// ───────────────────────────────────────────────────────────────────────────
// Central product + category data.
// This is the single source of truth for category pages and collections.
// Replace images/prices/names with real data later — the page code reads from here.
// ───────────────────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: CategorySlug;
  /** Collection slugs this product belongs to (besides its category). */
  collections?: CollectionSlug[];
  /** Defaults to true (in stock) when omitted. */
  inStock?: boolean;
};

export type CategorySlug =
  | "silk"
  | "cotton"
  | "designer"
  | "banarasi"
  | "kanjivaram"
  | "organza"
  | "linen";

export type CollectionSlug =
  | "wedding"
  | "new"
  | "new-arrivals"
  | "best-sellers"
  | "under-2500";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

export type Collection = {
  slug: CollectionSlug;
  name: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "silk", name: "Silk Sarees", description: "Regal, timeless silk weaves for every celebration." },
  { slug: "cotton", name: "Cotton Sarees", description: "Breathable, everyday elegance in pure cotton." },
  { slug: "designer", name: "Designer Sarees", description: "Statement drapes crafted by contemporary designers." },
  { slug: "banarasi", name: "Banarasi Sarees", description: "Opulent Banarasi weaves with intricate zari work." },
  { slug: "kanjivaram", name: "Kanjivaram Sarees", description: "South India's finest handwoven silk heritage." },
  { slug: "organza", name: "Organza Sarees", description: "Light, sheer and graceful organza drapes." },
  { slug: "linen", name: "Linen Sarees", description: "Crisp, comfortable linen for effortless style." },
];

export const collections: Collection[] = [
  { slug: "wedding", name: "Wedding Edit", description: "Showstopping sarees for the big day." },
  { slug: "new", name: "New Arrivals", description: "The latest additions to our collection." },
  { slug: "new-arrivals", name: "New Arrivals", description: "Fresh season, new designs, latest trends." },
  { slug: "best-sellers", name: "Best Sellers", description: "Our community's most-loved designs." },
  { slug: "under-2500", name: "Under ₹2500", description: "Beautiful drapes that fit every budget." },
];

export const products: Product[] = [
  { id: "p1", name: "Kanjivaram Royal Silk", slug: "kanjivaram-royal-silk", price: 8499, image: "https://picsum.photos/seed/p1/600/800", category: "kanjivaram", collections: ["best-sellers", "wedding"] },
  { id: "p2", name: "Banarasi Zari Weave", slug: "banarasi-zari-weave", price: 6999, image: "https://picsum.photos/seed/p2/600/800", category: "banarasi", collections: ["wedding", "new-arrivals"] },
  { id: "p3", name: "Organza Floral Drape", slug: "organza-floral-drape", price: 4299, image: "https://picsum.photos/seed/p3/600/800", category: "organza", collections: ["new-arrivals"], inStock: false },
  { id: "p4", name: "Handloom Cotton Classic", slug: "handloom-cotton-classic", price: 2799, image: "https://picsum.photos/seed/p4/600/800", category: "cotton", collections: ["best-sellers"] },
  { id: "p5", name: "Mysore Pure Silk", slug: "mysore-pure-silk", price: 9999, image: "https://picsum.photos/seed/p5/600/800", category: "silk", collections: ["best-sellers", "wedding"] },
  { id: "p6", name: "Chanderi Designer Edit", slug: "chanderi-designer-edit", price: 5499, image: "https://picsum.photos/seed/p6/600/800", category: "designer", collections: ["new-arrivals"] },
  { id: "p7", name: "Tussar Silk Heritage", slug: "tussar-silk-heritage", price: 7299, image: "https://picsum.photos/seed/p7/600/800", category: "silk", collections: ["best-sellers"], inStock: false },
  { id: "p8", name: "Linen Breeze Everyday", slug: "linen-breeze-everyday", price: 2199, image: "https://picsum.photos/seed/p8/600/800", category: "linen", collections: ["under-2500"] },
  { id: "p9", name: "Soft Cotton Daily Wear", slug: "soft-cotton-daily-wear", price: 1899, image: "https://picsum.photos/seed/p9/600/800", category: "cotton", collections: ["under-2500"] },
  { id: "p10", name: "Pastel Organza Sheer", slug: "pastel-organza-sheer", price: 2399, image: "https://picsum.photos/seed/p10/600/800", category: "organza", collections: ["under-2500", "new-arrivals"] },
  { id: "p11", name: "Designer Party Drape", slug: "designer-party-drape", price: 6499, image: "https://picsum.photos/seed/p11/600/800", category: "designer", collections: ["wedding"] },
  { id: "p12", name: "Banarasi Bridal Gold", slug: "banarasi-bridal-gold", price: 12999, image: "https://picsum.photos/seed/p12/600/800", category: "banarasi", collections: ["wedding", "best-sellers"] },
  { id: "p13", name: "Kanjivaram Temple Border", slug: "kanjivaram-temple-border", price: 10499, image: "https://picsum.photos/seed/p13/600/800", category: "kanjivaram", collections: ["wedding"] },
  { id: "p14", name: "Pure Linen Stripe", slug: "pure-linen-stripe", price: 3199, image: "https://picsum.photos/seed/p14/600/800", category: "linen", collections: ["new-arrivals"] },
  { id: "p15", name: "Everyday Silk Blend", slug: "everyday-silk-blend", price: 3499, image: "https://picsum.photos/seed/p15/600/800", category: "silk" },
  { id: "p16", name: "Cotton Jamdani Weave", slug: "cotton-jamdani-weave", price: 4299, image: "https://picsum.photos/seed/p16/600/800", category: "cotton", collections: ["new-arrivals"] },
];

// ── Lookups ──────────────────────────────────────────────────────────────────

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  // "new" and "new-arrivals" are the same edit; "under-2500" is price-driven.
  if (slug === "under-2500") {
    return products.filter((p) => p.price < 2500);
  }
  if (slug === "new") {
    return products.filter(
      (p) => p.collections?.includes("new-arrivals") || p.collections?.includes("new")
    );
  }
  return products.filter((p) => p.collections?.includes(slug as CollectionSlug));
}
