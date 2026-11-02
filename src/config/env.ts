// Centralized access to public environment variables.
// Only NEXT_PUBLIC_* vars are available in the browser.

export const env = {
  /** Shreeni backend API base URL. */
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  /** This site's own public URL (for SEO/canonical). */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
