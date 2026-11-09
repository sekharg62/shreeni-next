import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CategoryCard,
  CategoryChildrenParams,
  CategoryChildrenResponse,
  CategoryDetail,
} from "@/types/category";

export const categoryService = {
  /** Published direct children of a category, in admin order. Public, no token. 404 if the slug is unknown. */
  async children(params: CategoryChildrenParams): Promise<CategoryCard[]> {
    const { data } = await apiClient.get<CategoryChildrenResponse>(ENDPOINTS.categories.children, { params });
    if (!Array.isArray(data)) return [];
    return data
      .filter((c) => typeof c?.slug === "string" && c.slug !== "")
      // Defaults keep the card working against an older API that only sends name/slug/poster.
      .map((c) => ({
        ...c,
        tagline: c.tagline ?? null,
        minPrice: c.minPrice ?? null,
        maxDiscountPercent: c.maxDiscountPercent ?? 0,
      }));
  },

  /** One published category with its breadcrumb parents. Public. 404 if missing or unpublished. */
  async detail(slug: string): Promise<CategoryDetail> {
    const { data } = await apiClient.get<CategoryDetail>(ENDPOINTS.categories.detail(slug));
    return { ...data, ancestors: Array.isArray(data.ancestors) ? data.ancestors : [] };
  },
};
