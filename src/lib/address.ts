import type { Address, AddressInput, AddressLabel } from "@/types/address";
import { INDIAN_STATES } from "@/constants/indianStates";

export const LABELS: { value: AddressLabel; text: string }[] = [
  { value: "HOME", text: "Home" },
  { value: "WORK", text: "Work" },
  { value: "OTHER", text: "Other" },
];

export const labelText = (l: AddressLabel) => LABELS.find((x) => x.value === l)?.text ?? l;

/** "+919876543210" → "+91 98765 43210" */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : phone;
}

/** One-line-ish address for cards and summaries. */
export function addressLines(a: Pick<Address, "flatHouseNo" | "apartmentSector" | "landmark" | "city" | "state" | "pincode">) {
  return [
    [a.flatHouseNo, a.apartmentSector].filter(Boolean).join(", "),
    a.landmark ? `Near ${a.landmark.replace(/^near\s+/i, "")}` : null,
    `${a.city}, ${a.state} ${a.pincode}`,
  ].filter(Boolean) as string[];
}

export type AddressErrors = Partial<Record<keyof AddressInput, string>>;

/** Same rules as the backend, so most mistakes are caught before sending. */
export function validateAddress(a: AddressInput): AddressErrors {
  const e: AddressErrors = {};
  if (!a.receiverName.trim()) e.receiverName = "Enter the receiver's full name";
  if (!/^[6-9]\d{9}$/.test(a.receiverPhone)) e.receiverPhone = "Enter a valid 10-digit mobile number";
  if (!a.flatHouseNo.trim()) e.flatHouseNo = "Enter the flat / house number and building";
  if (!a.city.trim()) e.city = "Enter the city";
  if (!(INDIAN_STATES as readonly string[]).includes(a.state)) e.state = "Choose a state";
  if (!/^[1-9]\d{5}$/.test(a.pincode)) e.pincode = "Enter a valid 6-digit pincode";
  return e;
}

export const emptyAddress = (): AddressInput => ({
  label: "HOME",
  receiverName: "",
  receiverPhone: "",
  flatHouseNo: "",
  apartmentSector: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
});

/** Saved address → form values. */
export function toAddressInput(a: Address): AddressInput {
  return {
    label: a.label,
    receiverName: a.receiverName,
    receiverPhone: a.receiverPhone.replace(/\D/g, "").slice(-10),
    flatHouseNo: a.flatHouseNo,
    apartmentSector: a.apartmentSector ?? "",
    landmark: a.landmark ?? "",
    city: a.city,
    state: a.state,
    pincode: a.pincode,
  };
}
