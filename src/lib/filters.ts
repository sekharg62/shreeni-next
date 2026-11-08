/*
 * Category filters live in the URL, so they survive refresh, can be shared and work with Back:
 *   /sarees/handloom?color=red,teal&tag=bridal&price=1000-3000&offer=20&stock=1&sort=price-asc&page=2
 * Prices in the URL are in rupees; the API takes paise.
 */

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "discount", label: "Biggest discount" },
] as const;
export type Sort = (typeof SORTS)[number]["value"];
const SORT_VALUES = new Set<string>(SORTS.map((s) => s.value));

export type CatalogFilters = {
  /** Rupees */
  minPrice?: number;
  /** Rupees */
  maxPrice?: number;
  colors: string[];
  tags: string[];
  /** Minimum % off */
  offer?: number;
  inStock: boolean;
  sort: Sort;
  page: number;
};

/** What the API takes (paise, comma lists). Plain object so it can be a cache key. */
export type ApiFilterParams = {
  minPrice?: number;
  maxPrice?: number;
  colors?: string;
  tags?: string;
  minDiscount?: number;
  inStock?: boolean;
  sort?: Sort;
};

type RawParams = Record<string, string | string[] | undefined>;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const list = (v: string | string[] | undefined) =>
  [...new Set((first(v) ?? "").split(",").map((s) => s.trim().toLowerCase()).filter((s) => SLUG.test(s)))].slice(0, 30);
const wholeNumber = (v: string | undefined) => {
  const n = Number(v);
  return v !== undefined && v !== "" && Number.isInteger(n) && n >= 0 ? n : undefined;
};

/** URL search params → filters (bad values are ignored, never an error). */
export function parseFilters(params: RawParams): CatalogFilters {
  const [lo, hi] = (first(params.price) ?? "").split("-");
  const page = wholeNumber(first(params.page));
  const offer = wholeNumber(first(params.offer));
  const sort = first(params.sort);
  return {
    minPrice: wholeNumber(lo),
    maxPrice: wholeNumber(hi),
    colors: list(params.color),
    tags: list(params.tag),
    offer: offer && offer >= 1 && offer <= 90 ? offer : undefined,
    inStock: first(params.stock) === "1",
    sort: sort && SORT_VALUES.has(sort) ? (sort as Sort) : "featured",
    page: page && page >= 1 && page <= 1000 ? page : 1,
  };
}

/** Filters → "?color=red&page=2" (defaults left out; "" when nothing is set). */
export function toSearch(f: CatalogFilters): string {
  const q = new URLSearchParams();
  if (f.colors.length) q.set("color", f.colors.join(","));
  if (f.tags.length) q.set("tag", f.tags.join(","));
  if (f.minPrice !== undefined || f.maxPrice !== undefined) q.set("price", `${f.minPrice ?? ""}-${f.maxPrice ?? ""}`);
  if (f.offer) q.set("offer", String(f.offer));
  if (f.inStock) q.set("stock", "1");
  if (f.sort !== "featured") q.set("sort", f.sort);
  if (f.page > 1) q.set("page", String(f.page));
  const s = q.toString().replace(/%2C/g, ",");
  return s ? `?${s}` : "";
}

/** Same filters with some changes; any change other than the page goes back to page 1. */
export function withFilters(f: CatalogFilters, change: Partial<CatalogFilters>): CatalogFilters {
  return { ...f, ...change, page: change.page ?? 1 };
}

export const EMPTY_FILTERS: Omit<CatalogFilters, "sort" | "page"> = {
  minPrice: undefined,
  maxPrice: undefined,
  colors: [],
  tags: [],
  offer: undefined,
  inStock: false,
};

/** Any filter (not sort/page) selected? */
export const hasFilters = (f: CatalogFilters) =>
  f.colors.length > 0 || f.tags.length > 0 || f.minPrice !== undefined || f.maxPrice !== undefined || !!f.offer || f.inStock;

/** How many filter values are applied (for the mobile "Filter (3)" badge). */
export const filterCount = (f: CatalogFilters) =>
  f.colors.length + f.tags.length + (f.minPrice !== undefined || f.maxPrice !== undefined ? 1 : 0) + (f.offer ? 1 : 0) + (f.inStock ? 1 : 0);

/** Filters → API query params (rupees → paise). */
export function toApiParams(f: CatalogFilters): ApiFilterParams {
  return {
    ...(f.minPrice !== undefined && { minPrice: f.minPrice * 100 }),
    ...(f.maxPrice !== undefined && { maxPrice: f.maxPrice * 100 }),
    ...(f.colors.length && { colors: f.colors.join(",") }),
    ...(f.tags.length && { tags: f.tags.join(",") }),
    ...(f.offer && { minDiscount: f.offer }),
    ...(f.inStock && { inStock: true }),
    ...(f.sort !== "featured" && { sort: f.sort }),
  };
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** "Under ₹2,000", "₹2,000 – ₹5,000", "₹10,000+" */
export function priceLabel(min?: number, max?: number): string {
  if (min === undefined && max !== undefined) return `Under ${rupees(max)}`;
  if (min !== undefined && max === undefined) return `${rupees(min)}+`;
  if (min !== undefined && max !== undefined) return `${rupees(min)} – ${rupees(max)}`;
  return "Any price";
}
