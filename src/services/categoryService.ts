import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { CategoryCard, CategoryChildrenParams, CategoryChildrenResponse } from "@/types/category";

export const categoryService = {
  /** Published direct children of a category, in admin order. Public, no token. 404 if the slug is unknown. */
  async children(params: CategoryChildrenParams): Promise<CategoryCard[]> {
    const { data } = await apiClient.get<CategoryChildrenResponse>(ENDPOINTS.categories.children, { params });
    return Array.isArray(data) ? data.filter((c) => typeof c?.slug === "string" && c.slug !== "") : [];
  },
};
