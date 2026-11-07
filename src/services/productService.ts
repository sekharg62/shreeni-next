import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { paiseToRupees } from "@/lib/format";
import type { ProductCardDto, ProductCardItem, ProductCardPage, ProductListParams, ProductListResponse } from "@/types/product";

/** API card (paise) → UI card (rupees). */
export function toProductCardItem(p: ProductCardDto): ProductCardItem {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: paiseToRupees(p.price),
    compareAtPrice: p.compareAtPrice === null ? null : paiseToRupees(p.compareAtPrice),
    image: p.imageUrl,
  };
}

export const productService = {
  /** Published products of a category (and its sub-categories). Public. 404 if the category is unknown. */
  async list(params: ProductListParams): Promise<ProductCardPage> {
    const { data } = await apiClient.get<ProductListResponse>(ENDPOINTS.products.list, { params });
    return {
      items: Array.isArray(data?.data) ? data.data.map(toProductCardItem) : [],
      meta: data.meta,
    };
  },
};
