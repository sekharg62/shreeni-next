/** A sub-category card, as returned by `GET /categories/children?slug=…`. */
export type CategoryCard = {
  name: string;
  slug: string;
  /** Portrait image (≈3:4); null when none was uploaded in the admin. */
  posterUrl: string | null;
};

/** Query for `GET /categories/children`. */
export type CategoryChildrenParams = {
  /** Slug of the parent category, e.g. "saree". */
  slug: string;
};

/** `GET /categories/children` response body: published children in display order. */
export type CategoryChildrenResponse = CategoryCard[];
