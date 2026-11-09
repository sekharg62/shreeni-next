import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Paginated } from "@/types/api";
import type {
  CategoryCard,
  CategoryChildrenParams,
  CategoryChildrenResponse,
  CategoryDetail,
} from "@/types/category";

/** Drops cards without a slug. Defaults keep the card working against an older API that only sends name/slug/poster. */
function cleanCards(cards: CategoryCard[]): CategoryCard[] {
  return cards
    .filter((c) => typeof c?.slug === "string" && c.slug !== "")
    .map((c) => ({
      ...c,
      tagline: c.tagline ?? null,
      minPrice: c.minPrice ?? null,
      maxDiscountPercent: c.maxDiscountPercent ?? 0,
    }));
}

export const categoryService = {
  /**
   * One page of a category's published direct children, in admin order. Public, no token.
   * 404 if the slug is unknown.
   */
  async children(params: CategoryChildrenParams): Promise<Paginated<CategoryCard>> {
    const { data } = await apiClient.get<CategoryChildrenResponse | CategoryCard[]>(ENDPOINTS.categories.children, {
      params,
    });
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    // An older API sends the whole list as a bare array: page it here so callers always see one shape.
    if (Array.isArray(data)) {
      const all = cleanCards(data);
      return {
        data: all.slice((page - 1) * limit, page * limit),
        meta: { page, limit, total: all.length, totalPages: Math.max(1, Math.ceil(all.length / limit)) },
      };
    }
    if (!data || !Array.isArray(data.data)) return { data: [], meta: { page, limit, total: 0, totalPages: 1 } };
    return { data: cleanCards(data.data), meta: data.meta };
  },

  /** Every published direct child (walks all pages). For prerendering / sitemaps, not for pages people see. */
  async allChildren(slug: string): Promise<CategoryCard[]> {
    const out: CategoryCard[] = [];
    for (let page = 1, totalPages = 1; page <= totalPages && page <= 100; page++) {
      const res = await categoryService.children({ slug, page, limit: 50 });
      out.push(...res.data);
      totalPages = res.meta.totalPages;
    }
    return out;
  },

  /** One published category with its breadcrumb parents. Public. 404 if missing or unpublished. */
  async detail(slug: string): Promise<CategoryDetail> {
    const { data } = await apiClient.get<CategoryDetail>(ENDPOINTS.categories.detail(slug));
    return { ...data, ancestors: Array.isArray(data.ancestors) ? data.ancestors : [] };
  },
};
