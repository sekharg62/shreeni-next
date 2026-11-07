import { authApiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Address, AddressInput, AddressListResponse, AddressUpdate } from "@/types/address";

/** The signed-in customer's saved addresses. Every call needs the customer token. */
export const addressService = {
  async list(): Promise<Address[]> {
    const { data } = await authApiClient.get<AddressListResponse>(ENDPOINTS.addresses.list);
    return Array.isArray(data) ? data : [];
  },

  async create(input: AddressInput): Promise<Address> {
    const { data } = await authApiClient.post<Address>(ENDPOINTS.addresses.list, input);
    return data;
  },

  async update(id: string, input: AddressUpdate): Promise<Address> {
    const { data } = await authApiClient.patch<Address>(ENDPOINTS.addresses.one(id), input);
    return data;
  },

  /** Returns the updated list. */
  async makeDefault(id: string): Promise<Address[]> {
    const { data } = await authApiClient.patch<AddressListResponse>(ENDPOINTS.addresses.makeDefault(id));
    return data;
  },

  /** Returns the updated list. */
  async remove(id: string): Promise<Address[]> {
    const { data } = await authApiClient.delete<AddressListResponse>(ENDPOINTS.addresses.one(id));
    return data;
  },
};
