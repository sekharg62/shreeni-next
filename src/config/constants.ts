// App-wide constants. Import from "@/config/constants".

/**
 * Next.js cache tags for server-fetched catalogue data.
 * Pass one to `revalidateTag` / `updateTag` to refresh that data right away.
 */
export const CACHE_TAGS = {
  banners: "banners",
  categories: "categories",
  products: "products",
  reviews: "reviews",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Category slugs the storefront depends on. Must exist in the admin. */
export const CATEGORY_SLUGS = {
  /** Parent whose sub-categories fill "Our Top Categories" on the home page. */
  homeTopCategoriesParent: "saree",
} as const;

/** Products per page on listing pages (backend allows up to 48). */
export const PRODUCTS_PER_PAGE = 24;

/** How many related products the product page shows (backend allows up to 12). */
export const RELATED_PRODUCTS_LIMIT = 8;

/** Reviews per page on the product page (backend allows up to 20). */
export const REVIEWS_PER_PAGE = 5;

/** Orders at or above this (₹) ship free — matches the announcement bar. */
export const FREE_SHIPPING_THRESHOLD = 1999;
