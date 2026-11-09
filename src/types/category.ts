import type { Paginated } from "./api";

/** A sub-category card, as returned by `GET /categories/children?slug=…`. */
export type CategoryCard = {
  name: string;
  slug: string;
  /** Portrait image (≈3:4); null when none was uploaded in the admin. */
  posterUrl: string | null;
  /** One short line under the name, e.g. "Mythology woven in silk". */
  tagline: string | null;
  /** Lowest selling price in paise; null when the category is empty. */
  minPrice: number | null;
  /** Biggest % off right now (0 = nothing on sale). */
  maxDiscountPercent: number;
};

/** Query for `GET /categories/children`. */
export type CategoryChildrenParams = {
  /** Slug of the parent category, e.g. "saree". */
  slug: string;
  /** Page number, starting at 1 (backend default 1). */
  page?: number;
  /** Cards per page, max 50 (backend default 10). */
  limit?: number;
};

/** `GET /categories/children` response body: one page of published children, in display order. */
export type CategoryChildrenResponse = Paginated<CategoryCard>;

/** A parent shown in the breadcrumb. `slug` is null when that parent isn't published (not linkable). */
export type CategoryCrumb = {
  name: string;
  slug: string | null;
};

/** `GET /categories/:slug` response body — the category page header. */
export type CategoryDetail = {
  name: string;
  slug: string;
  description: string | null;
  /** Wide desktop banner (≈8:3). */
  bannerUrl: string | null;
  /** Portrait image (≈3:4), used on phones. */
  posterUrl: string | null;
  /** Parents, top-most first. */
  ancestors: CategoryCrumb[];
};
