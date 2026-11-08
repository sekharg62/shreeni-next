"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Info, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackEcommerce } from "@/lib/analytics";
import { firstTimeTracked, readLastOrder } from "@/lib/lastOrder";
import { orderService } from "@/services/orderService";
import type { OrderDetail } from "@/types/order";
import OrderDetailView, { CopyOrderNumber } from "./OrderDetailView";
import { spacedOrderNumber } from "./orderMeta";

/** Report the purchase to analytics once per order (not again on reload). */
function reportPurchase(order: OrderDetail) {
  if (!firstTimeTracked(order.orderNumber)) return;
  trackEcommerce(
    "purchase",
    order.items.map((i) => ({ name: i.name, price: i.unitPrice, quantity: i.quantity, size: i.size ?? undefined })),
    {
      transaction_id: order.orderNumber,
      value: order.grandTotal,
      shipping: order.shippingTotal,
      ...(order.discountCode && { coupon: order.discountCode, discount: order.discountTotal }),
    },
  );
}

/** "Thank you" page after checkout. Guests see the order saved in this tab; customers load it from their account. */
export default function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  const { status, user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (status === "loading") return;
    const saved = readLastOrder(orderNumber);
    if (saved) {
      void Promise.resolve().then(() => {
        setOrder(saved);
        setState("ready");
      });
      return;
    }
    if (status !== "signed-in") {
      void Promise.resolve().then(() => setState("missing"));
      return;
    }
    orderService.get(orderNumber).then(
      (o) => {
        setOrder(o);
        setState("ready");
      },
      () => setState("missing"),
    );
  }, [orderNumber, status]);

  useEffect(() => {
    if (order) reportPurchase(order);
  }, [order]);

  const trackHref = status === "signed-in" ? `/account/orders/${orderNumber}` : `/track?order=${orderNumber}`;

  if (state === "loading") {
    return <div aria-busy="true" className="h-96 animate-pulse rounded-lg bg-background" />;
  }

  const firstName = user?.firstName || order?.shippingAddress.receiverName.split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-green-200 bg-green-50/60 p-6 text-center sm:p-10">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-3xl font-semibold text-dark sm:text-4xl">
          Thank you{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="mt-2 text-muted">
          {order?.status === "PENDING"
            ? "Your order is placed and waiting for payment."
            : "Your order is confirmed. We'll let you know as soon as it ships."}
        </p>
        <div className="mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2">
          <span className="text-sm text-muted">Order ID</span>
          <span className="font-mono text-base font-semibold tracking-wide text-dark">{spacedOrderNumber(orderNumber)}</span>
          <CopyOrderNumber value={orderNumber} />
        </div>
        {status !== "signed-in" && (
          <p className="mx-auto mt-4 flex max-w-md items-start justify-center gap-2 text-left text-sm text-dark/80">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Save this order ID — you&apos;ll need it with your mobile number or email to track the order.
          </p>
        )}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={trackHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
          >
            <Package className="h-4 w-4" aria-hidden="true" /> {status === "signed-in" ? "View order" : "Track order"}
          </Link>
          <Link
            href="/sarees"
            className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-surface"
          >
            Continue shopping
          </Link>
        </div>
      </div>

      {order ? (
        <OrderDetailView order={order} showHeader={false} />
      ) : (
        <p className="text-center text-sm text-muted">
          Your order details are on the{" "}
          <Link href={trackHref} className="font-semibold text-primary hover:underline">
            order tracking page
          </Link>
          .
        </p>
      )}
    </div>
  );
}
