import { cacheLife, cacheTag } from "next/cache";
import { bannerService } from "@/services/bannerService";
import type { Banner } from "@/types/banner";
import HeroCarousel from "./HeroCarousel";

/** Tag to pass to `revalidateTag` / `updateTag` when banners change. */
export const BANNERS_CACHE_TAG = "banners";

async function getHomeBanners(): Promise<Banner[]> {
  "use cache";
  cacheTag(BANNERS_CACHE_TAG);
  try {
    const banners = await bannerService.list();
    cacheLife("minutes"); // admin edits show up within about a minute
    return banners;
  } catch (err) {
    // Backend down: render the page without the hero and retry soon.
    console.error("[HeroBanners] could not load banners:", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return [];
  }
}

/** Server component: loads the banners, hands them to the client carousel. */
export default async function HeroBanners() {
  const banners = await getHomeBanners();
  if (banners.length === 0) return null;
  return <HeroCarousel banners={banners} />;
}
