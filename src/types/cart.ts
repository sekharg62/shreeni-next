/** Why a cart line can't be bought as-is. */
export type CartIssue = "OUT_OF_STOCK" | "QUANTITY_REDUCED" | "UNAVAILABLE";

/** A cart line as the API sends it. Prices are in paise. */
export type CartLineDto = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  size: string;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  /** Most that can be ordered now (0–10). */
  available: number;
  issue: CartIssue | null;
};

/** `GET /me/cart`, and the body of every cart change. */
export type CartDto = {
  items: CartLineDto[];
  itemCount: number;
  /** paise */
  subtotal: number;
};

export type CartItemInput = { variantId: string; quantity: number };
