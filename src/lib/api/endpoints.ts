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
    /** ?category=<slug>&page=&limit= */
    list: "/products",
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
  auth: {
    register: "/auth/register",
    /** customers only — the admin panel uses /admin/auth/login */
    login: "/auth/login",
    me: "/auth/me",
  },
} as const;
