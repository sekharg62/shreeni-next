// Cached catalogue reads for Server Components. Each function is one cache entry
// per argument set; tags let the admin refresh them on demand.
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS, CATEGORY_SLUGS, PRODUCTS_PER_PAGE } from "@/config/constants";
import { getApiErrorStatus } from "@/lib/api";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import type { CategoryDetail } from "@/types/category";
import type { ProductCardPage } from "@/types/product";

/** A published category, or null if it doesn't exist / isn't published. Other errors throw (not cached). */
export async function getCategory(slug: string): Promise<CategoryDetail | null> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  cacheLife("minutes");
  try {
    return await categoryService.detail(slug);
  } catch (err) {
    if (getApiErrorStatus(err) === 404) return null;
    throw err;
  }
}

/** One page of a category's product cards, or null if the category is gone. */
export async function getCategoryProducts(slug: string, page: number): Promise<ProductCardPage | null> {
  "use cache";
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.categories);
  cacheLife("minutes");
  try {
    return await productService.list({ category: slug, page, limit: PRODUCTS_PER_PAGE });
  } catch (err) {
    if (getApiErrorStatus(err) === 404) return null;
    throw err;
  }
}

/** Slugs to prerender at build time; [] if the backend is unreachable. */
export async function getPrerenderCategorySlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  try {
    const list = await categoryService.children({ slug: CATEGORY_SLUGS.homeTopCategoriesParent });
    cacheLife("minutes");
    return list.map((c) => c.slug);
  } catch {
    cacheLife("seconds");
    return [];
  }
}
