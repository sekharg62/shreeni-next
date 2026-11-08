"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CloudOff, LifeBuoy, Loader2, RotateCw, XCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api";
import { orderService } from "@/services/orderService";
import type { OrderDetail } from "@/types/order";
import OrderDetailView from "./OrderDetailView";

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Want to change the items or address",
  "Found a better price elsewhere",
  "Delivery is taking too long",
  "Other",
];

/** One of the signed-in customer's orders, with cancel (until it's packed) and a link to support. */
export default function MyOrderDetail({ orderNumber }: { orderNumber: string }) {
  const toast = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "missing">("loading");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [cancelling, setCancelling] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    setState("loading");
    orderService.get(orderNumber).then(
      (o) => {
        setOrder(o);
        setState("ready");
      },
      (err: unknown) => {
        if (getApiErrorStatus(err) === 404) return setState("missing");
        setError(getApiErrorMessage(err, "We couldn't load this order."));
        setState("error");
      },
    );
  }, [orderNumber]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  useEffect(() => {
    if (confirming) panelRef.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
  }, [confirming]);

  const cancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancel(orderNumber, reason);
      setOrder(updated);
      setConfirming(false);
      toast.success(updated.payment?.status === "REFUNDED" ? "Order cancelled. Your refund is on its way." : "Order cancelled.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "We couldn't cancel this order. Please try again."));
      load();
    } finally {
      setCancelling(false);
    }
  };

  const back = (
    <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> My orders
    </Link>
  );

  if (state === "loading") return <div aria-busy="true" className="h-96 animate-pulse rounded-lg bg-background" />;

  if (state === "missing" || state === "error" || !order) {
    return (
      <div className="space-y-4">
        {back}
        <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <CloudOff className="h-8 w-8 text-muted" aria-hidden="true" />
          <p className="font-medium text-dark">{state === "missing" ? "We couldn't find this order in your account." : error}</p>
          {state === "error" ? (
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full border border-dark px-5 py-2 text-xs font-semibold uppercase tracking-wider text-dark transition-colors hover:bg-dark hover:text-surface"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
            </button>
          ) : (
            <p className="text-sm text-muted">
              Placed it as a guest?{" "}
              <Link href={`/track?order=${orderNumber}`} className="font-semibold text-primary hover:underline">
                Track it with your phone or email
              </Link>
            </p>
          )}
        </div>
      </div>
    );
  }

  const actions = (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:p-6">
      {confirming ? (
        <div ref={panelRef}>
          <h2 className="font-serif text-lg font-semibold text-dark">Cancel this order?</h2>
          <p className="mt-1 text-sm text-muted">
            {order.payment?.status === "PAID" ? "Your payment will be refunded to the original payment method." : "Nothing has been charged."}
          </p>
          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-medium text-dark">Why are you cancelling?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {CANCEL_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                    reason === r ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input type="radio" name="cancel-reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-primary" />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={cancelling}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:border-primary"
            >
              Keep my order
            </button>
            <button
              type="button"
              onClick={() => void cancel()}
              disabled={cancelling}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {cancelling && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Yes, cancel order
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {order.canCancel
              ? "You can cancel until the order is packed."
              : order.status === "CANCELLED" || order.status === "RETURNED"
                ? "Questions about this order?"
                : "Need to change or return something?"}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/account/support/new"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:border-primary hover:text-primary"
            >
              <LifeBuoy className="h-4 w-4" aria-hidden="true" /> Get help
            </Link>
            {order.canCancel && (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" aria-hidden="true" /> Cancel order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {back}
      <OrderDetailView order={order} actions={actions} />
    </div>
  );
}
