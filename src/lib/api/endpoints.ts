/** Backend API paths, relative to `NEXT_PUBLIC_API_BASE_URL`. */
export const ENDPOINTS = {
  banners: {
    list: "/banners",
  },
  auth: {
    login: "/auth/login",
  },
} as const;
