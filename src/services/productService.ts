import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { paiseToRupees } from "@/lib/format";
import type { ApiFilterParams } from "@/lib/filters";
import type {
  ProductCardDto,
  ProductFacets,
  SearchSort,
  SearchSuggestions,
  SearchSuggestionsDto,
  ProductCardItem,
  ProductCardPage,
  ProductDetail,
  ProductDetailResponse,
  ProductListParams,
  ProductListResponse,
  RelatedProductsParams,
  RelatedProductsResponse,
} from "@/types/product";

const money = (paise: number | null) => (paise === null ? null : paiseToRupees(paise));

/** API card (paise) → UI card (rupees). */
export function toProductCardItem(p: ProductCardDto): ProductCardItem {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: paiseToRupees(p.price),
    compareAtPrice: money(p.compareAtPrice),
    image: p.imageUrl,
    hoverImage: p.hoverImageUrl ?? null,
    categoryName: p.categoryName ?? null,
    inStock: p.inStock,
    fewLeft: p.fewLeft ?? null,
  };
}

/** API product (paise) → page model (rupees). */
export function toProductDetail(p: ProductDetailResponse): ProductDetail {
  const variants = (p.variants ?? []).map((v) => ({
    ...v,
    price: paiseToRupees(v.price),
    compareAtPrice: money(v.compareAtPrice),
  }));
  return {
    ...p,
    price: paiseToRupees(p.price),
    compareAtPrice: money(p.compareAtPrice),
    images: (p.images ?? []).map((i) => i.url).filter(Boolean),
    variants,
    tags: p.tags ?? [],
    colors: p.colors ?? [],
    breadcrumb: p.breadcrumb ?? [],
    inStock: variants.some((v) => v.available > 0),
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

  /** Filter options (colours, tags, prices, offers, stock) with counts for a category. Public. */
  async facets(params: ApiFilterParams & { category: string }, signal?: AbortSignal): Promise<ProductFacets> {
    const { data } = await apiClient.get<ProductFacets>(ENDPOINTS.products.facets, { params, signal });
    return data;
  },

  /** Typo-tolerant product search, ranked by relevance (or sorted). Public. */
  async search(params: { q: string; sort?: SearchSort; page?: number; limit?: number }): Promise<ProductCardPage> {
    const { data } = await apiClient.get<ProductListResponse>(ENDPOINTS.products.search, { params });
    return { items: Array.isArray(data?.data) ? data.data.map(toProductCardItem) : [], meta: data.meta };
  },

  /** Search-as-you-type suggestions. Public. */
  async suggest(q: string, signal?: AbortSignal): Promise<SearchSuggestions> {
    const { data } = await apiClient.get<SearchSuggestionsDto>(ENDPOINTS.products.suggest, { params: { q }, signal });
    return { categories: data.categories ?? [], products: (data.products ?? []).map(toProductCardItem), total: data.total ?? 0 };
  },

  /** One published product for its page (everything except related). Public. 404 if missing. */
  async detail(slug: string): Promise<ProductDetail> {
    const { data } = await apiClient.get<ProductDetailResponse>(ENDPOINTS.products.detail(slug));
    return toProductDetail(data);
  },

  /** Related cards: admin picks first, topped up from the same category. Public. */
  async related(slug: string, params: RelatedProductsParams = {}): Promise<ProductCardItem[]> {
    const { data } = await apiClient.get<RelatedProductsResponse>(ENDPOINTS.products.related(slug), { params });
    return Array.isArray(data) ? data.map(toProductCardItem) : [];
  },
};
