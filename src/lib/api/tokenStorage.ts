// Where the signed-in customer's JWT lives in the browser.
// Every function is safe to call on the server (there is no token there) and
// survives storage being blocked (private mode, disabled site data).

// Separate from the admin panel's "shreeni_admin_token".
export const AUTH_TOKEN_KEY = "shreeni_customer_token";

/** Fired on `window` when the backend rejects the token (expired / revoked). */
export const AUTH_EXPIRED_EVENT = "shreeni:auth-expired";

const isBrowser = () => typeof window !== "undefined";

export const tokenStorage = {
  get(): string | null {
    if (!isBrowser()) return null;
    try {
      return window.localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  set(token: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      /* storage unavailable — the session just won't persist */
    }
  },

  clear(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};
