import { apiClient, authApiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { CartDto, CartItemInput } from "@/types/cart";

/** Server cart for signed-in customers, plus a public price/stock check for guest carts. */
export const cartService = {
  async get(): Promise<CartDto> {
    const { data } = await authApiClient.get<CartDto>(ENDPOINTS.cart.mine);
    return data;
  },

  /** Set a line's quantity (0 removes). Returns the whole cart. */
  async setQuantity(variantId: string, quantity: number): Promise<CartDto> {
    const { data } = await authApiClient.put<CartDto>(ENDPOINTS.cart.item(variantId), { quantity });
    return data;
  },

  async remove(variantId: string): Promise<CartDto> {
    const { data } = await authApiClient.delete<CartDto>(ENDPOINTS.cart.item(variantId));
    return data;
  },

  async clear(): Promise<CartDto> {
    const { data } = await authApiClient.delete<CartDto>(ENDPOINTS.cart.mine);
    return data;
  },

  /** Add a guest's browser cart to the account. Returns the merged cart. */
  async merge(items: CartItemInput[]): Promise<CartDto> {
    const { data } = await authApiClient.post<CartDto>(ENDPOINTS.cart.merge, { items });
    return data;
  },

  /** Live prices and stock for a guest cart. Sizes that no longer exist are left out. */
  async preview(items: CartItemInput[]): Promise<CartDto> {
    const { data } = await apiClient.post<CartDto>(ENDPOINTS.cart.preview, { items });
    return data;
  },
};
