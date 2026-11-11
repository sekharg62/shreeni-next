"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api";
import { orderService } from "@/services/orderService";
import type { OrderDetail } from "@/types/order";
import InvoiceButton from "./InvoiceButton";
import OrderDetailView from "./OrderDetailView";

const ORDER_ID = /^OD\d{12}$/;
const clean = (v: string) => v.toUpperCase().replace(/\s+/g, "");

/** Order lookup for everyone: order ID + the mobile number or email used at checkout. */
export default function TrackOrder() {
  const params = useSearchParams();
  const { status } = useAuth();
  const [orderNumber, setOrderNumber] = useState(() => clean(params.get("order") ?? ""));
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<{ orderNumber?: string; contact?: string }>({});
  const [result, setResult] = useState<OrderDetail | null>(null);
  /** The phone/email that found `result` (needed again to download its invoice). */
  const [foundWith, setFoundWith] = useState("");
  const [notFound, setNotFound] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const number = clean(orderNumber);
    const c = contact.trim();
    const next: typeof errors = {};
    if (!ORDER_ID.test(number)) next.orderNumber = "Enter the order ID from your confirmation, e.g. OD261108482913";
    if (!c) next.contact = "Enter the mobile number or email you used at checkout";
    else if (!c.includes("@") && c.replace(/\D/g, "").length < 10) next.contact = "Enter a 10-digit mobile number or an email";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setNotFound(null);
    try {
      setResult(await orderService.track(number, c));
      setFoundWith(c);
    } catch (err) {
      setResult(null);
      setNotFound(getApiErrorMessage(err, "We couldn't find that order. Please check the details."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} noValidate className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="track-order"
            label="Order ID"
            placeholder="e.g. OD261108482913"
            autoComplete="off"
            spellCheck={false}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            error={errors.orderNumber}
            hint="It's on your order confirmation."
          />
          <Input
            id="track-contact"
            label="Mobile number or email"
            placeholder="98765 43210 or you@example.com"
            autoComplete="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            error={errors.contact}
            hint="The one you gave at checkout."
          />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {status === "signed-in" ? (
            <p className="text-sm text-muted">
              Signed in?{" "}
              <Link href="/account/orders" className="font-semibold text-primary hover:underline">
                See all your orders
              </Link>
            </p>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
            Track order
          </button>
        </div>
        {notFound && (
          <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {notFound}
          </p>
        )}
      </form>

      <div aria-live="polite">
        {result && (
          <OrderDetailView
            order={result}
            actions={
              result.hasInvoice ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted">Your invoice for this order, as a PDF.</p>
                  <InvoiceButton
                    fetchPdf={() => orderService.trackInvoice(result.orderNumber, foundWith)}
                    invoiceNumber={result.invoiceNumber}
                    orderNumber={result.orderNumber}
                  />
                </div>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
