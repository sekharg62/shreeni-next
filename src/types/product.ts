import type { PageMeta, Paginated } from "./api";

/** Query for `GET /products`. */
export type ProductListParams = {
  /** Category slug; its sub-categories are included. */
  category: string;
  page?: number;
  /** 1–48, default 24 */
  limit?: number;
};

/** One product as the API sends it. Prices are in paise. */
export type ProductCardDto = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
};

/** `GET /products` response body. */
export type ProductListResponse = Paginated<ProductCardDto>;

/** What `<ProductCard>` renders. Prices are in rupees. */
export type ProductCardItem = {
  id: string;
  name: string;
  slug?: string;
  /** Rupees — what the customer pays. */
  price: number;
  /** Rupees — struck-through original price when on discount. */
  compareAtPrice?: number | null;
  image: string | null;
  /** Defaults to true when omitted. */
  inStock?: boolean;
};

/** A page of cards, ready for the UI. */
export type ProductCardPage = {
  items: ProductCardItem[];
  meta: PageMeta;
};
