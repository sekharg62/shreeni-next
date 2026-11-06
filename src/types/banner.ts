/** One home-page banner, as returned by `GET /banners`. */
export type Banner = {
  /** Also used as the image's alt text. */
  title: string | null;
  subtitle: string | null;
  /** Desktop image (1920×720). */
  imageUrl: string;
  /** Portrait crop for phones; falls back to `imageUrl` when null. */
  mobileImageUrl: string | null;
  /** Site path ("/sarees/jamdani") or full URL; null = not clickable. */
  linkUrl: string | null;
};

/** `GET /banners` response body: published banners in display order. */
export type BannerListResponse = Banner[];
