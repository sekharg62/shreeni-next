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
  },
  auth: {
    login: "/auth/login",
  },
} as const;
