import { apiClient, getApiErrorStatus } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type PincodeInfo = {
  pincode: string;
  /** null for the few PIN codes India Post lists without a district. */
  district: string | null;
  /** Same spelling as INDIAN_STATES. */
  state: string;
};

/** Answers (including "not found") are remembered for this visit. */
const cache = new Map<string, PincodeInfo | null>();

export const pincodeService = {
  /**
   * What we already know about a PIN code, without a request:
   * the info, null (doesn't exist), or undefined (not checked yet / couldn't check).
   */
  peek(pincode: string): PincodeInfo | null | undefined {
    return cache.get(pincode);
  },

  /** null = no such PIN code. Throws on network/server errors. */
  async lookup(pincode: string, signal?: AbortSignal): Promise<PincodeInfo | null> {
    if (cache.has(pincode)) return cache.get(pincode)!;
    try {
      const { data } = await apiClient.get<PincodeInfo>(ENDPOINTS.pincodes.lookup(pincode), { signal, timeout: 6000 });
      cache.set(pincode, data);
      return data;
    } catch (err) {
      if (getApiErrorStatus(err) === 404) {
        cache.set(pincode, null);
        return null;
      }
      throw err;
    }
  },
};
