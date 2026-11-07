"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, SendHorizontal } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { supportService } from "@/services/supportService";
import { SUPPORT_LIMITS, ticketLabel, type SupportReason } from "@/types/support";
import { REASON_META, REASON_ORDER } from "./supportMeta";

const { descriptionMin: MIN, textMax: MAX } = SUPPORT_LIMITS;

/** Pick what it's about, describe it, send. Opens the new ticket on success. */
export default function NewTicketForm() {
  const router = useRouter();
  const toast = useToast();
  const [reason, setReason] = useState<SupportReason | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const length = description.trim().length;
  const reasonError = touched && !reason ? "Choose what your request is about." : null;
  const descriptionError =
    touched && length < MIN ? `Please add a little more detail (at least ${MIN} characters).` : null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (!reason || length < MIN || length > MAX) return;
    setSubmitting(true);
    try {
      const ticket = await supportService.create({ reason, description: description.trim() });
      toast.success(`Request ${ticketLabel(ticket.ticketNumber)} sent. We'll reply here soon.`);
      router.push(`/account/support/${ticket.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't send your request. Please try again."));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <fieldset aria-describedby={reasonError ? "reason-error" : undefined}>
        <legend className="text-sm font-semibold text-dark">What do you need help with?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {REASON_ORDER.map((value) => {
            const { label, hint, icon: Icon } = REASON_META[value];
            const selected = reason === value;
            return (
              <label
                key={value}
                className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                  selected ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={value}
                  checked={selected}
                  onChange={() => setReason(value)}
                  className="sr-only"
                />
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    selected ? "bg-primary text-surface" : "bg-background text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-dark">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{hint}</span>
                </span>
                {selected && <CircleCheck className="absolute right-3 top-3 h-4 w-4 text-primary" aria-hidden="true" />}
              </label>
            );
          })}
        </div>
        {reasonError && (
          <p id="reason-error" className="mt-2 text-sm text-red-700">
            {reasonError}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="description" className="text-sm font-semibold text-dark">
          Tell us what happened
        </label>
        <p id="description-hint" className="mt-1 text-xs text-muted">
          Include your order number if it&apos;s about an order. The more detail, the faster we can help.
        </p>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX}
          rows={6}
          aria-invalid={!!descriptionError}
          aria-describedby={`description-hint description-count${descriptionError ? " description-error" : ""}`}
          placeholder="e.g. My order SH-10234 was due on Monday but tracking hasn't changed for 3 days."
          className={`mt-3 w-full resize-y rounded-lg border bg-surface px-4 py-3 text-sm text-dark placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary ${
            descriptionError ? "border-red-400" : "border-border"
          }`}
        />
        <div className="mt-1 flex items-start justify-between gap-4 text-xs">
          <p id="description-error" className="text-red-700">
            {descriptionError}
          </p>
          <p id="description-count" className={`shrink-0 tabular-nums ${length > 0 && length < MIN ? "text-amber-700" : "text-muted"}`}>
            {length < MIN && length > 0 ? `${MIN - length} more to go` : `${description.length}/${MAX}`}
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-6 py-3 text-sm font-semibold text-muted transition-colors hover:text-dark"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark disabled:opacity-60"
        >
          <SendHorizontal className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Sending…" : "Send request"}
        </button>
      </div>
    </form>
  );
}
