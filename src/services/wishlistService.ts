import { authApiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ProductCardDto, ProductCardItem } from "@/types/product";
import { toProductCardItem } from "./productService";

const toItems = (data: unknown): ProductCardItem[] =>
  Array.isArray(data) ? (data as ProductCardDto[]).map(toProductCardItem) : [];

/** The signed-in customer's wishlist. Every call needs the customer token. */
export const wishlistService = {
  /** Saved products, most recently saved first. */
  async list(): Promise<ProductCardItem[]> {
    const { data } = await authApiClient.get<ProductCardDto[]>(ENDPOINTS.wishlist.list);
    return toItems(data);
  },

  async add(productId: string): Promise<void> {
    await authApiClient.put(ENDPOINTS.wishlist.one(productId));
  },

  async remove(productId: string): Promise<void> {
    await authApiClient.delete(ENDPOINTS.wishlist.one(productId));
  },

  /** Add items saved as a guest; returns the full wishlist. */
  async merge(productIds: string[]): Promise<ProductCardItem[]> {
    const { data } = await authApiClient.post<ProductCardDto[]>(ENDPOINTS.wishlist.merge, { productIds });
    return toItems(data);
  },
};
