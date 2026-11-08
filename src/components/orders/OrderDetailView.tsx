"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy, CreditCard, MapPin, Truck, XCircle } from "lucide-react";
import { addressLines, formatPhone } from "@/lib/address";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import type { OrderDetail } from "@/types/order";
import OrderTimeline from "./OrderTimeline";
import { OrderStatusBadge, spacedOrderNumber } from "./orderMeta";

const PAYMENT_LABEL: Record<string, string> = { test: "Test payment" };
const PAYMENT_STATUS: Record<string, string> = { CREATED: "Not paid yet", PAID: "Paid", FAILED: "Payment failed", REFUNDED: "Refunded" };

export function CopyOrderNumber({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      aria-label={copied ? "Order ID copied" : "Copy order ID"}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-background hover:text-primary"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-700" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Card({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-dark">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Everything about one order: status, tracking timeline, items, delivery, payment and totals. */
export default function OrderDetailView({ order, actions, showHeader = true }: { order: OrderDetail; actions?: ReactNode; showHeader?: boolean }) {
  const a = order.shippingAddress;
  const refunded = order.payment?.status === "REFUNDED";
  return (
    <div className="space-y-5">
      {showHeader && (
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Order ID</p>
            <div className="flex items-center gap-1">
              <h1 className="font-mono text-xl font-semibold tracking-wide text-dark sm:text-2xl">{spacedOrderNumber(order.orderNumber)}</h1>
              <CopyOrderNumber value={order.orderNumber} />
            </div>
            <p className="mt-1 text-sm text-muted">Placed on {formatDateTime(order.placedAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </header>
      )}

      {order.status === "CANCELLED" && (
        <div role="status" className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-semibold">This order was cancelled{order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ""}.</p>
            {order.cancelReason && <p className="mt-0.5">Reason: {order.cancelReason}</p>}
            {refunded && <p className="mt-0.5">{formatINR(order.payment!.amount)} has been refunded to your original payment method.</p>}
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card title="Tracking" icon={<Truck className="h-4 w-4 text-primary" aria-hidden="true" />}>
          <OrderTimeline status={order.status} events={order.timeline} />
          {order.shipment && (
            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-md bg-background p-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Courier</dt>
                <dd className="font-medium text-dark">{order.shipment.deliveryPartner}</dd>
              </div>
              {order.shipment.awb && (
                <div>
                  <dt className="text-xs text-muted">Tracking no.</dt>
                  <dd className="break-all font-mono font-medium text-dark">{order.shipment.awb}</dd>
                </div>
              )}
            </dl>
          )}
        </Card>

        <Card title={`Items (${order.itemCount})`}>
          <ul className="divide-y divide-border">
            {order.items.map((i, idx) => {
              const name = i.slug ? (
                <Link href={`/products/${i.slug}`} className="hover:text-primary hover:underline">
                  {i.name}
                </Link>
              ) : (
                i.name
              );
              return (
                <li key={idx} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-background">
                    {i.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium text-dark">{name}</p>
                    {i.size && <p className="text-xs text-muted">Size: {i.size}</p>}
                    <p className="mt-0.5 text-xs text-muted">
                      Qty {i.quantity}
                      {i.quantity > 1 && <> × {formatINR(i.unitPrice)}</>}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-dark">{formatINR(i.lineTotal)}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Delivery address" icon={<MapPin className="h-4 w-4 text-primary" aria-hidden="true" />}>
          <address className="text-sm not-italic leading-relaxed text-dark/80">
            <span className="font-medium text-dark">{a.receiverName}</span>
            {addressLines(a).map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
            <span className="mt-1 block text-muted">Mobile: {formatPhone(a.receiverPhone)}</span>
          </address>
        </Card>

        <Card title="Payment" icon={<CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />}>
          {order.payment && (
            <p className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-dark">{PAYMENT_LABEL[order.payment.provider] ?? order.payment.provider}</span>
              <span className={`font-semibold ${order.payment.status === "PAID" ? "text-green-700" : order.payment.status === "FAILED" ? "text-red-700" : "text-muted"}`}>
                {PAYMENT_STATUS[order.payment.status]}
              </span>
            </p>
          )}
          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-dark">{formatINR(order.subtotal)}</dd>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-green-700">
                <dt>Coupon {order.discountCode}</dt>
                <dd>−{formatINR(order.discountTotal)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className={order.shippingTotal === 0 ? "font-medium text-green-700" : "text-dark"}>
                {order.shippingTotal === 0 ? "Free" : formatINR(order.shippingTotal)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-semibold text-dark">Total</dt>
              <dd className="font-serif text-lg font-semibold text-dark">{formatINR(order.grandTotal)}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {actions}
    </div>
  );
}
