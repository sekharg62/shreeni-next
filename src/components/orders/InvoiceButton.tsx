"use client";

import { useState } from "react";
import axios from "axios";
import { FileDown, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { getApiErrorMessage } from "@/lib/api";

type Props = {
  /** Fetches the PDF (customer or guest endpoint). */
  fetchPdf: () => Promise<Blob>;
  invoiceNumber?: string | null;
  orderNumber: string;
  className?: string;
};

/** A failed blob request carries its JSON error as a Blob: read the message out of it. */
async function errorMessage(err: unknown): Promise<string> {
  if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
    try {
      const body = JSON.parse(await err.response.data.text()) as { message?: unknown };
      const m = body.message;
      const text = typeof m === "string" ? m : Array.isArray(m) ? m.join(", ") : (m as { message?: string })?.message;
      if (text) return text;
    } catch {
      /* not JSON */
    }
  }
  return getApiErrorMessage(err, "Couldn't download the invoice. Please try again.");
}

/** "Download invoice": fetches the PDF and saves it with a readable file name. */
export default function InvoiceButton({ fetchPdf, invoiceNumber, orderNumber, className = "" }: Props) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await fetchPdf();
      const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Shreeni-Invoice-${(invoiceNumber ?? orderNumber).replace(/\//g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Give the browser a moment to start the download before freeing it.
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      toast.error(await errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void download()}
      disabled={busy}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-surface disabled:opacity-60 ${className}`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileDown className="h-4 w-4" aria-hidden="true" />}
      {busy ? "Preparing…" : "Download invoice"}
    </button>
  );
}
