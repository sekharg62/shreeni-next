"use client";

import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { INDIAN_STATES } from "@/constants/indianStates";
import { LABELS, type AddressErrors } from "@/lib/address";
import type { AddressInput } from "@/types/address";

const STATE_OPTIONS = INDIAN_STATES.map((s) => ({ label: s, value: s }));

type Props = {
  value: AddressInput;
  onChange: (next: AddressInput) => void;
  errors: AddressErrors;
  /** Prefix for input ids, so two forms can live on one page. */
  idPrefix?: string;
  /** Hide the Home / Work / Other choice (guest checkout). */
  hideLabel?: boolean;
};

/** Delivery address fields. Controlled; validation lives in lib/address. */
export default function AddressFields({ value, onChange, errors, idPrefix = "addr", hideLabel }: Props) {
  const set = <K extends keyof AddressInput>(key: K, v: AddressInput[K]) => onChange({ ...value, [key]: v });
  const id = (k: string) => `${idPrefix}-${k}`;
  const digits = (s: string, max: number) => s.replace(/\D/g, "").slice(0, max);

  return (
    <div className="space-y-5">
      {!hideLabel && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-dark">Save as</legend>
          <div role="radiogroup" className="flex flex-wrap gap-2">
            {LABELS.map((l) => (
              <button
                key={l.value}
                type="button"
                role="radio"
                aria-checked={value.label === l.value}
                onClick={() => set("label", l.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  value.label === l.value
                    ? "border-primary bg-primary text-surface"
                    : "border-border text-dark hover:border-primary"
                }`}
              >
                {l.text}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id={id("receiverName")}
          label="Full name"
          autoComplete="name"
          value={value.receiverName}
          onChange={(e) => set("receiverName", e.target.value)}
          error={errors.receiverName}
          maxLength={100}
        />
        <Input
          id={id("receiverPhone")}
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          prefix="+91"
          placeholder="10-digit number"
          value={value.receiverPhone}
          // Pasting "+91 98765 43210" keeps the last 10 digits.
          onChange={(e) => set("receiverPhone", e.target.value.replace(/\D/g, "").slice(-10))}
          error={errors.receiverPhone}
          hint="The courier may call this number."
        />
      </div>

      <Input
        id={id("flatHouseNo")}
        label="Flat, house no., building"
        autoComplete="address-line1"
        placeholder="e.g. Flat 4B, Rose Apartments"
        value={value.flatHouseNo}
        onChange={(e) => set("flatHouseNo", e.target.value)}
        error={errors.flatHouseNo}
        maxLength={150}
      />
      <Input
        id={id("apartmentSector")}
        label="Area, street, sector (optional)"
        autoComplete="address-line2"
        placeholder="e.g. Salt Lake, Sector 5"
        value={value.apartmentSector ?? ""}
        onChange={(e) => set("apartmentSector", e.target.value)}
        maxLength={150}
      />
      <Input
        id={id("landmark")}
        label="Landmark (optional)"
        placeholder="e.g. Near City Centre"
        value={value.landmark ?? ""}
        onChange={(e) => set("landmark", e.target.value)}
        maxLength={100}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id={id("pincode")}
          label="Pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="6-digit pincode"
          value={value.pincode}
          onChange={(e) => set("pincode", digits(e.target.value, 6))}
          error={errors.pincode}
        />
        <Input
          id={id("city")}
          label="City / town"
          autoComplete="address-level2"
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
          error={errors.city}
          maxLength={80}
        />
      </div>

      <SearchableSelect
        id={id("state")}
        label="State"
        placeholder="Select state"
        searchPlaceholder="Search state…"
        emptyText="No state matches — check the spelling"
        options={STATE_OPTIONS}
        value={value.state || null}
        onChange={(v) => set("state", v)}
        error={errors.state}
      />
    </div>
  );
}

/** Focus the first field with an error inside `root`. */
export function focusFirstAddressError(root: HTMLElement | null, errors: AddressErrors, idPrefix = "addr") {
  const order: (keyof AddressInput)[] = ["receiverName", "receiverPhone", "flatHouseNo", "pincode", "city", "state"];
  const first = order.find((k) => errors[k]);
  if (first) root?.querySelector<HTMLElement>(`#${idPrefix}-${first}`)?.focus();
}
