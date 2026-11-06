import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/config/env";
import { AUTH_EXPIRED_EVENT, tokenStorage } from "./tokenStorage";

/** Error body sent by the Nest backend's exception filter. */
export type ApiErrorBody = {
  statusCode: number;
  path?: string;
  timestamp?: string;
  /** a string, a string[] (validation), or a nested `{ message, error, statusCode }` */
  message?: unknown;
};

function createClient(): AxiosInstance {
  return axios.create({
    baseURL: env.apiBaseUrl,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeout: 15000,
  });
}

/**
 * Public client — never sends a token.
 * Use for catalogue data (categories, collections, products, banners).
 * Works in Server Components, route handlers and the browser.
 */
export const apiClient = createClient();

/**
 * Authenticated client — attaches `Authorization: Bearer <token>` automatically
 * when the customer is signed in (cart, wishlist, orders, profile).
 * With no token the request goes out without the header, so the backend decides.
 * Browser only in practice: on the server there is no stored token.
 */
export const authApiClient = createClient();

authApiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    // Token expired or revoked: forget it and let the UI react (show sign-in, etc.).
    if (error.response?.status === 401 && tokenStorage.get()) {
      tokenStorage.clear();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
    }
    return Promise.reject(error);
  },
);

function readMessage(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const parts = value.filter((v): v is string => typeof v === "string");
    return parts.length ? parts.join(", ") : null;
  }
  if (value && typeof value === "object" && "message" in value) {
    return readMessage((value as { message?: unknown }).message);
  }
  return null;
}

/** A human-readable message from any error thrown by either client. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return error.code === "ECONNABORTED"
        ? "The server took too long to respond."
        : "Can't reach the server. Check your connection.";
    }
    return readMessage(error.response.data?.message) ?? fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

/** HTTP status of an API error, or `undefined` for network / non-HTTP errors. */
export function getApiErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}
