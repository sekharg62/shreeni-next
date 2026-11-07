export type AddressLabel = "HOME" | "WORK" | "OTHER";

/** A saved address, as `GET /me/addresses` returns it. */
export type Address = {
  id: string;
  label: AddressLabel;
  receiverName: string;
  /** "+91XXXXXXXXXX" */
  receiverPhone: string;
  flatHouseNo: string;
  apartmentSector: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

/** `POST /me/addresses` body (also the guest checkout address). */
export type AddressInput = {
  label: AddressLabel;
  receiverName: string;
  /** 10 digits; the API adds +91 */
  receiverPhone: string;
  flatHouseNo: string;
  apartmentSector?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
};

/** `PATCH /me/addresses/:id` body. */
export type AddressUpdate = Partial<AddressInput>;

/** `GET /me/addresses`, `PATCH …/default`, `DELETE …` response body. */
export type AddressListResponse = Address[];
