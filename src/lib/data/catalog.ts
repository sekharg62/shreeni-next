// Cached catalogue reads for Server Components. Each function is one cache entry
// per argument set; tags let the admin refresh them on demand.
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS, CATEGORY_SLUGS, PRODUCTS_PER_PAGE, RELATED_PRODUCTS_LIMIT, REVIEWS_PER_PAGE } from "@/config/constants";
import { getApiErrorStatus } from "@/lib/api";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import { reviewService } from "@/services/reviewService";
import type { ReviewListResponse } from "@/types/review";
import type { CategoryDetail } from "@/types/category";
import type { ProductCardItem, ProductCardPage, ProductDetail, ProductFacets, SearchSort } from "@/types/product";
import type { ApiFilterParams } from "@/lib/filters";

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
export async function getCategoryProducts(
  slug: string,
  page: number,
  filters: ApiFilterParams = {},
): Promise<ProductCardPage | null> {
  "use cache";
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.categories);
  cacheLife("minutes");
  try {
    return await productService.list({ category: slug, page, limit: PRODUCTS_PER_PAGE, ...filters });
  } catch (err) {
    if (getApiErrorStatus(err) === 404) return null;
    throw err;
  }
}

/** Filter options with counts for a category (one cache entry per filter combination); null if unavailable. */
export async function getCategoryFacets(slug: string, filters: ApiFilterParams = {}): Promise<ProductFacets | null> {
  "use cache";
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.categories);
  try {
    // Sorting doesn't change the options.
    const params: ApiFilterParams = { ...filters };
    delete params.sort;
    const facets = await productService.facets({ category: slug, ...params });
    cacheLife("minutes");
    return facets;
  } catch {
    cacheLife("seconds");
    return null;
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

/** A published product for its page, or null if it doesn't exist / isn't published. */
export async function getProduct(slug: string): Promise<ProductDetail | null> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("minutes");
  try {
    return await productService.detail(slug);
  } catch (err) {
    if (getApiErrorStatus(err) === 404) return null;
    throw err;
  }
}

/** Related cards for a product; [] on any failure (the section is optional). */
export async function getRelatedProducts(slug: string): Promise<ProductCardItem[]> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  try {
    const items = await productService.related(slug, { limit: RELATED_PRODUCTS_LIMIT });
    cacheLife("minutes");
    return items;
  } catch {
    cacheLife("seconds");
    return [];
  }
}

/** Product slugs to prerender: first page of each top category. [] if the backend is unreachable. */
export async function getPrerenderProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  try {
    const categories = await getPrerenderCategorySlugs();
    const pages = await Promise.all(
      categories.map((c) => productService.list({ category: c, page: 1, limit: PRODUCTS_PER_PAGE }).catch(() => null)),
    );
    cacheLife("minutes");
    return [...new Set(pages.flatMap((p) => p?.items.map((i) => i.slug ?? "") ?? []).filter(Boolean))];
  } catch {
    cacheLife("seconds");
    return [];
  }
}

/** First page of approved reviews + summary; null if unavailable (the section shows a fallback). */
export async function getProductReviews(slug: string): Promise<ReviewListResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.reviews);
  try {
    const page = await reviewService.list(slug, { page: 1, limit: REVIEWS_PER_PAGE });
    cacheLife("minutes"); // newly approved reviews show within about a minute
    return page;
  } catch {
    cacheLife("seconds");
    return null;
  }
}

/** Everything the sitemap lists: every published sub-category and every product in them (all pages). */
export async function getSitemapCatalog(): Promise<{
  categories: string[];
  products: { slug: string; image: string | null }[];
}> {
  "use cache";
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.categories);
  try {
    const categories = await getPrerenderCategorySlugs();
    const products = new Map<string, string | null>();
    for (const category of categories) {
      // Largest page the API allows, so big categories take few requests.
      for (let page = 1, totalPages = 1; page <= totalPages && page <= 100; page++) {
        const res = await productService.list({ category, page, limit: 48 }).catch(() => null);
        if (!res) break;
        totalPages = res.meta.totalPages;
        for (const p of res.items) if (p.slug && !products.has(p.slug)) products.set(p.slug, p.image);
      }
    }
    cacheLife("hours");
    return { categories, products: [...products].map(([slug, image]) => ({ slug, image })) };
  } catch {
    cacheLife("seconds");
    return { categories: [], products: [] };
  }
}

/** One page of search results (one cache entry per query/sort/page); null if search is unavailable. */
export async function getSearchResults(q: string, page: number, sort: SearchSort): Promise<ProductCardPage | null> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  try {
    const result = await productService.search({ q, page, sort, limit: PRODUCTS_PER_PAGE });
    cacheLife("minutes");
    return result;
  } catch {
    cacheLife("seconds");
    return null;
  }
}
