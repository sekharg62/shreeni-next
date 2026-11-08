/** Backend API paths, relative to `NEXT_PUBLIC_API_BASE_URL`. */
export const ENDPOINTS = {
  banners: {
    list: "/banners",
  },
  categories: {
    /** ?slug=<parent> → its published children */
    children: "/categories/children",
    detail: (slug: string) => `/categories/${encodeURIComponent(slug)}`,
  },
  products: {
    /** ?category=<slug>&page=&limit= plus filters (minPrice, maxPrice, colors, tags, minDiscount, inStock, sort) */
    list: "/products",
    /** ?category=<slug> plus the same filters → options with counts */
    facets: "/products/facets",
    /** ?q=&sort=relevance|newest|price-asc|price-desc|discount&page=&limit= — typo-tolerant search */
    search: "/products/search",
    /** ?q= — search-as-you-type: categories + top products */
    suggest: "/products/suggest",
    detail: (slug: string) => `/products/${encodeURIComponent(slug)}`,
    /** ?limit= (1–12) */
    related: (slug: string) => `/products/${encodeURIComponent(slug)}/related`,
  },
  reviews: {
    /** GET ?page=&limit= (approved only) · POST (signed-in customer) */
    list: (slug: string) => `/products/${encodeURIComponent(slug)}/reviews`,
    /** GET — the signed-in customer's own review */
    mine: (slug: string) => `/products/${encodeURIComponent(slug)}/reviews/mine`,
  },
  addresses: {
    /** GET list · POST create (signed-in customer) */
    list: "/me/addresses",
    /** PATCH edit · DELETE */
    one: (id: string) => `/me/addresses/${encodeURIComponent(id)}`,
    /** PATCH — make default */
    makeDefault: (id: string) => `/me/addresses/${encodeURIComponent(id)}/default`,
  },
  wishlist: {
    /** GET saved products as cards (signed-in customer) */
    list: "/me/wishlist",
    /** PUT save · DELETE remove */
    one: (productId: string) => `/me/wishlist/${encodeURIComponent(productId)}`,
    /** POST { productIds } — add a guest's items after sign-in; returns the full list */
    merge: "/me/wishlist/merge",
  },
  pincodes: {
    /** GET — city, district, state and post offices for a 6-digit PIN (public) */
    lookup: (pincode: string) => `/pincodes/${encodeURIComponent(pincode)}`,
  },
  cart: {
    /** GET the signed-in customer's cart · DELETE empties it */
    mine: "/me/cart",
    /** PUT { quantity } sets (0 removes) · DELETE removes */
    item: (variantId: string) => `/me/cart/items/${encodeURIComponent(variantId)}`,
    /** POST { items } — add a guest's cart after sign-in */
    merge: "/me/cart/merge",
    /** POST { items } — live prices/stock for a guest cart (public, saves nothing) */
    preview: "/cart/preview",
  },
  support: {
    /** GET ?page=&limit= · POST { reason, description } (signed-in customer) */
    list: "/me/support-tickets",
    one: (id: string) => `/me/support-tickets/${encodeURIComponent(id)}`,
    /** POST { body } */
    messages: (id: string) => `/me/support-tickets/${encodeURIComponent(id)}/messages`,
    /** PATCH */
    close: (id: string) => `/me/support-tickets/${encodeURIComponent(id)}/close`,
  },
  orders: {
    /** POST { items, couponCode? } — live totals + coupon check for checkout (guest or signed in; saves nothing) */
    quote: "/checkout/quote",
    /** POST — place an order (guest or signed in) */
    place: "/orders",
    /** POST { orderNumber, contact } — look an order up with the phone/email used (public) */
    track: "/orders/track",
    /** GET ?page=&limit= — the signed-in customer's orders */
    mine: "/me/orders",
    one: (orderNumber: string) => `/me/orders/${encodeURIComponent(orderNumber)}`,
    /** POST { reason? } */
    cancel: (orderNumber: string) => `/me/orders/${encodeURIComponent(orderNumber)}/cancel`,
  },
  auth: {
    register: "/auth/register",
    /** customers only — the admin panel uses /admin/auth/login */
    login: "/auth/login",
    me: "/auth/me",
  },
} as const;
