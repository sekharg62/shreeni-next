"use client";

import { useCallback, useEffect, useRef, useState, type SubmitEvent } from "react";
import { Loader2, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import AddressFields, { focusFirstAddressError } from "./AddressFields";
import { useToast } from "@/context/ToastContext";
import { addressService } from "@/services/addressService";
import { getApiErrorMessage } from "@/lib/api";
import { addressLines, emptyAddress, formatPhone, labelText, toAddressInput, validateAddress, type AddressErrors } from "@/lib/address";
import type { Address, AddressInput } from "@/types/address";

const MAX_ADDRESSES = 10;

type FormState = { mode: "add" } | { mode: "edit"; address: Address } | null;

function AddressEditor({
  initial,
  title,
  submitLabel,
  idPrefix,
  onSave,
  onCancel,
  canCancel,
}: {
  initial: AddressInput;
  title: string;
  submitLabel: string;
  idPrefix: string;
  onSave: (input: AddressInput) => Promise<void>;
  onCancel: () => void;
  canCancel: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);

  const change = (next: AddressInput) => {
    setValue(next);
    setFormError(null);
    if (submitted) setErrors(validateAddress(next));
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setSubmitted(true);
    const errs = validateAddress(value);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstAddressError(ref.current, errs, idPrefix);
    setBusy(true);
    try {
      await onSave({
        ...value,
        receiverName: value.receiverName.trim(),
        flatHouseNo: value.flatHouseNo.trim(),
        apartmentSector: value.apartmentSector?.trim() ?? "",
        landmark: value.landmark?.trim() ?? "",
        city: value.city.trim(),
      });
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form ref={ref} onSubmit={submit} noValidate className="rounded-lg border border-primary/40 bg-surface p-5 sm:p-6">
      <h3 className="mb-5 font-semibold text-dark">{title}</h3>
      {formError && (
        <p role="alert" className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}
      <AddressFields value={value} onChange={change} errors={errors} idPrefix={idPrefix} />
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-background"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-dark disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

type Props = {
  /** "select": radio cards for checkout. "manage": plain list for the account page. */
  mode: "select" | "manage";
  selectedId?: string | null;
  onSelect?: (address: Address | null) => void;
  /** Name/phone to pre-fill a new address with (e.g. the account's). */
  prefill?: Partial<AddressInput>;
};

/** Saved addresses: list, add, edit, delete, set default — and pick one at checkout. */
export default function AddressBook({ mode, selectedId, onSelect, prefill }: Props) {
  const toast = useToast();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);
  const [pending, setPending] = useState<string | null>(null); // id being changed
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const selectRef = useRef(onSelect);
  useEffect(() => {
    selectRef.current = onSelect;
  });

  /** Keep a valid selection: the current one if still there, else the default. */
  const reconcile = useCallback(
    (list: Address[], prefer?: string | null) => {
      if (mode !== "select") return;
      const keep = list.find((a) => a.id === (prefer ?? selectedId)) ?? list.find((a) => a.isDefault) ?? list[0] ?? null;
      selectRef.current?.(keep);
    },
    [mode, selectedId],
  );

  const load = useCallback(() => {
    return addressService.list().then(
      (list) => {
        setLoadError(null);
        setAddresses(list);
        // No addresses yet → open the form straight away.
        if (list.length === 0) setForm({ mode: "add" });
        return list;
      },
      (err: unknown) => {
        setLoadError(getApiErrorMessage(err));
        return null;
      },
    );
  }, []);

  useEffect(() => {
    let alive = true;
    void load().then((list) => {
      if (alive && list) reconcile(list);
    });
    return () => {
      alive = false;
    };
    // load once per mount; reconcile only for the initial list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (input: AddressInput) => {
    if (form?.mode === "edit") {
      const updated = await addressService.update(form.address.id, input);
      const list = (addresses ?? []).map((a) => (a.id === updated.id ? updated : a));
      setAddresses(list);
      reconcile(list, updated.id);
      toast.success("Address updated");
    } else {
      const created = await addressService.create(input);
      const list = await addressService.list();
      setAddresses(list);
      reconcile(list, created.id);
      toast.success("Address saved");
    }
    setForm(null);
  };

  const makeDefault = async (id: string) => {
    setPending(id);
    try {
      const list = await addressService.makeDefault(id);
      setAddresses(list);
      toast.success("Default address updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setPending(null);
    }
  };

  const remove = async (id: string) => {
    setPending(id);
    try {
      const list = await addressService.remove(id);
      setAddresses(list);
      setConfirmDelete(null);
      reconcile(list, selectedId === id ? null : selectedId);
      if (list.length === 0) setForm({ mode: "add" });
      toast.info("Address deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setPending(null);
    }
  };

  if (loadError) {
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn&apos;t load your addresses. {loadError}{" "}
        <button
          type="button"
          onClick={() => {
            setLoadError(null);
            void load().then((l) => l && reconcile(l));
          }}
          className="font-semibold underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!addresses) {
    return (
      <div aria-busy="true" aria-label="Loading addresses" className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-background" />
        ))}
      </div>
    );
  }

  const editing = form?.mode === "edit" ? form.address.id : null;
  const full = addresses.length >= MAX_ADDRESSES;

  return (
    <div className="space-y-3">
      {addresses.length > 0 && (
        <ul role={mode === "select" ? "radiogroup" : undefined} aria-label="Saved addresses" className="space-y-3">
          {addresses.map((a) => {
            if (editing === a.id) {
              return (
                <li key={a.id}>
                  <AddressEditor
                    initial={toAddressInput(a)}
                    title="Edit address"
                    submitLabel="Save changes"
                    idPrefix={`edit-${a.id.slice(0, 8)}`}
                    onSave={save}
                    onCancel={() => setForm(null)}
                    canCancel
                  />
                </li>
              );
            }
            const selected = mode === "select" && selectedId === a.id;
            const busy = pending === a.id;
            return (
              <li
                key={a.id}
                role={mode === "select" ? "radio" : undefined}
                aria-checked={mode === "select" ? selected : undefined}
                tabIndex={mode === "select" ? 0 : undefined}
                onClick={mode === "select" ? () => onSelect?.(a) : undefined}
                onKeyDown={
                  mode === "select"
                    ? (e) => {
                        if (e.target === e.currentTarget && (e.key === " " || e.key === "Enter")) {
                          e.preventDefault();
                          onSelect?.(a);
                        }
                      }
                    : undefined
                }
                className={`relative rounded-lg border bg-surface p-4 transition-colors sm:p-5 ${
                  mode === "select" ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" : ""
                } ${selected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
              >
                <div className="flex gap-3">
                  {mode === "select" && (
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? "border-primary" : "border-border"
                      }`}
                    >
                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-dark">{a.receiverName}</span>
                      <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                        {labelText(a.label)}
                      </span>
                      {a.isDefault && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                          Default
                        </span>
                      )}
                    </p>
                    <address className="mt-1 text-sm not-italic leading-relaxed text-dark/80">
                      {addressLines(a).map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                      <span className="block text-muted">Mobile: {formatPhone(a.receiverPhone)}</span>
                    </address>

                    {confirmDelete === a.id ? (
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm" onClick={(e) => e.stopPropagation()}>
                        <span className="text-dark">Delete this address?</span>
                        <button
                          type="button"
                          onClick={() => void remove(a.id)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />} Delete
                        </button>
                        <button type="button" onClick={() => setConfirmDelete(null)} className="font-semibold text-dark hover:text-primary">
                          Keep
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setForm({ mode: "edit", address: a })}
                          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-secondary"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                        </button>
                        {!a.isDefault && (
                          <button
                            type="button"
                            onClick={() => void makeDefault(a.id)}
                            disabled={busy}
                            className="inline-flex items-center gap-1.5 font-semibold text-dark hover:text-primary disabled:opacity-60"
                          >
                            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Star className="h-3.5 w-3.5" aria-hidden="true" />}
                            Set as default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(a.id)}
                          aria-label={`Delete address of ${a.receiverName}, ${a.city}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-muted hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {form?.mode === "add" ? (
        <AddressEditor
          initial={{ ...emptyAddress(), ...prefill }}
          title={addresses.length === 0 ? "Add a delivery address" : "Add a new address"}
          submitLabel={mode === "select" ? "Save and deliver here" : "Save address"}
          idPrefix="new"
          onSave={save}
          onCancel={() => setForm(null)}
          canCancel={addresses.length > 0}
        />
      ) : full ? (
        <p className="text-sm text-muted">You&apos;ve saved {MAX_ADDRESSES} addresses — delete one to add another.</p>
      ) : (
        <button
          type="button"
          onClick={() => setForm({ mode: "add" })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-surface"
        >
          {addresses.length === 0 ? <MapPin className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
          Add a new address
        </button>
      )}
    </div>
  );
}
