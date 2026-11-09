import { apiClient, getApiErrorStatus } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { toProductCardItem } from "@/services/productService";
import type { HomePickDto, ProductCardItem } from "@/types/product";

export const homePickService = {
  /**
   * The admin's homepage picks: live, in stock, in admin order, as cards with their badge.
   * Public, no token. [] on an older API without the endpoint (404), so the section just hides.
   */
  async list(limit: number): Promise<ProductCardItem[]> {
    try {
      const { data } = await apiClient.get<HomePickDto[]>(ENDPOINTS.homePicks.list, { params: { limit } });
      if (!Array.isArray(data)) return [];
      return data
        .filter((p) => typeof p?.slug === "string" && p.slug !== "")
        .map((p) => ({ ...toProductCardItem(p), badge: p.badge ?? null }));
    } catch (err) {
      if (getApiErrorStatus(err) === 404) return [];
      throw err;
    }
  },
};
