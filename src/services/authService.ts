import { apiClient, authApiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthResponse, Customer, LoginPayload, MeResponse, RegisterPayload } from "@/types/auth";

export const authService = {
  /** Create a customer account; returns the user and a token. */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.auth.register, payload);
    return data;
  },

  /** Sign in with email or mobile + password. */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.auth.login, payload);
    return data;
  },

  /** The signed-in customer (uses the stored token). */
  async me(): Promise<Customer> {
    const { data } = await authApiClient.get<MeResponse>(ENDPOINTS.auth.me);
    return data;
  },
};
