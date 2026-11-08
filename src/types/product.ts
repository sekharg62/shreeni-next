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
  /** false when every size is sold out */
  inStock: boolean;
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

/* ───────────── Product page ───────────── */

/** A size as the API sends it (prices in paise). */
export type ProductVariantDto = {
  id: string;
  size: string;
  price: number;
  compareAtPrice: number | null;
  /** 0 = sold out; capped at 10 by the API. */
  available: number;
};

export type ProductTag = { name: string; slug: string; color: string | null };

export type ProductColor = { type: "PRIMARY" | "SECONDARY"; name: string; hexCode: string | null };

export type ProductSpec = { label: string; value: string };

export type ProductFacts = {
  fabric: string | null;
  lengthCm: number | null;
  widthCm: number | null;
  blousePiece: boolean;
  blousePieceInfo: string | null;
  washCare: string | null;
};

export type ProductMaker = {
  countryOfOrigin: string | null;
  manufacturedBy: string | null;
  manufacturerAddress: string | null;
};

/** Breadcrumb step; `slug` null = that category isn't published (not linkable). */
export type ProductCrumb = { name: string; slug: string | null };

/** `GET /products/:slug` response body (prices in paise). */
export type ProductDetailResponse = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  story: string | null;
  price: number;
  compareAtPrice: number | null;
  images: { url: string }[];
  variants: ProductVariantDto[];
  tags: ProductTag[];
  colors: ProductColor[];
  facts: ProductFacts;
  specifications: { details: ProductSpec[]; manufacturing: ProductSpec[] };
  maker: ProductMaker;
  breadcrumb: ProductCrumb[];
};

/** A size, ready for the UI (prices in rupees). */
export type ProductVariant = Omit<ProductVariantDto, "price" | "compareAtPrice"> & {
  price: number;
  compareAtPrice: number | null;
};

/** The product page model (prices in rupees, image URLs flattened). */
export type ProductDetail = Omit<ProductDetailResponse, "price" | "compareAtPrice" | "images" | "variants"> & {
  price: number;
  compareAtPrice: number | null;
  images: string[];
  variants: ProductVariant[];
  /** Any size can be ordered right now. */
  inStock: boolean;
};

/** Query for `GET /products/:slug/related`. */
export type RelatedProductsParams = { limit?: number };

/** `GET /products/:slug/related` response body. */
export type RelatedProductsResponse = ProductCardDto[];
