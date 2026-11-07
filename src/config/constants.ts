// App-wide constants. Import from "@/config/constants".

/**
 * Next.js cache tags for server-fetched catalogue data.
 * Pass one to `revalidateTag` / `updateTag` to refresh that data right away.
 */
export const CACHE_TAGS = {
  banners: "banners",
  categories: "categories",
  products: "products",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Category slugs the storefront depends on. Must exist in the admin. */
export const CATEGORY_SLUGS = {
  /** Parent whose sub-categories fill "Our Top Categories" on the home page. */
  homeTopCategoriesParent: "saree",
} as const;

/** Products per page on listing pages (backend allows up to 48). */
export const PRODUCTS_PER_PAGE = 24;
