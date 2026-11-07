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
  auth: {
    login: "/auth/login",
  },
} as const;
