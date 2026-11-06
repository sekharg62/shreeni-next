import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Banner, BannerListResponse } from "@/types/banner";

export const bannerService = {
  /** Published home-page banners, in the order set in the admin. Public, no token. */
  async list(): Promise<Banner[]> {
    const { data } = await apiClient.get<BannerListResponse>(ENDPOINTS.banners.list);
    // Guard against an unexpected body so the page never crashes on it.
    return Array.isArray(data) ? data.filter((b) => typeof b?.imageUrl === "string" && b.imageUrl !== "") : [];
  },
};
