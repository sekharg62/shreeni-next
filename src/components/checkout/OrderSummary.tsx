"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { CartItem } from "@/context/CartContext";
import type { CheckoutQuote } from "@/types/order";

/** Lines that can't be checked out yet (no size chosen). */
export const needsSize = (i: CartItem) => !i.variantId && !!i.slug;

function Lines({ items }: { items: CartItem[] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((i) => (
        <li key={i.id} className="flex gap-3 py-3">
          {/* Outer box is not clipped so the qty badge can sit fully on the corner. */}
          <div className="relative h-16 w-12 shrink-0">
            <div className="h-full w-full overflow-hidden rounded-md border border-border bg-background">
              {i.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <span
              aria-label={`Quantity ${i.quantity}`}
              className="absolute -right-2 -top-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-dark px-1.5 text-[11px] font-semibold leading-none text-surface shadow-sm ring-2 ring-surface"
            >
              {i.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium text-dark">{i.name}</p>
            {i.issue === "OUT_OF_STOCK" || i.issue === "UNAVAILABLE" ? (
              <p className="text-xs font-semibold text-red-700">
                {i.issue === "OUT_OF_STOCK" ? "Out of stock" : "No longer available"} — remove from cart
              </p>
            ) : i.size ? (
              <p className="text-xs text-muted">Size: {i.size}</p>
            ) : needsSize(i) ? (
              <Link href={`/products/${i.slug}`} className="text-xs font-semibold text-amber-700 underline underline-offset-2">
                Choose a size to continue
              </Link>
            ) : null}
            <p className="mt-0.5 text-xs text-muted">
              Qty {i.quantity}
              {i.quantity > 1 && <> × {formatINR(i.price)}</>}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium text-dark">{formatINR(i.price * i.quantity)}</p>
        </li>
      ))}
    </ul>
  );
}

/** Totals from the server quote (coupon, shipping); just the subtotal until it arrives. */
function Totals({ subtotal, quote }: { subtotal: number; quote?: CheckoutQuote | null }) {
  const total = quote ? quote.grandTotal : subtotal;
  return (
    <dl className="space-y-2 border-t border-border pt-4 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="font-medium text-dark">{formatINR(quote?.subtotal ?? subtotal)}</dd>
      </div>
      {quote?.coupon && (
        <div className="flex justify-between text-green-700">
          <dt>
            Coupon <span className="font-mono">{quote.coupon.code}</span>
          </dt>
          <dd>−{formatINR(quote.coupon.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className={quote && quote.shippingTotal > 0 ? "text-dark" : "font-medium text-green-700"}>
          {quote && quote.shippingTotal > 0 ? formatINR(quote.shippingTotal) : "Free"}
        </dd>
      </div>
      <div className="flex justify-between border-t border-border pt-3 text-base">
        <dt className="font-semibold text-dark">Total</dt>
        <dd className="font-serif text-lg font-semibold text-dark">{formatINR(total)}</dd>
      </div>
      <p className="text-xs text-muted">Inclusive of all taxes.</p>
    </dl>
  );
}

type SummaryProps = {
  items: CartItem[];
  subtotal: number;
  count: number;
  /** "bar": collapsible strip for phones. "sidebar": sticky panel for desktop. */
  variant: "bar" | "sidebar";
  /** Server totals (coupon, shipping) when available. */
  quote?: CheckoutQuote | null;
};

/** Order summary — render the "bar" above the form on phones and the "sidebar" on desktop. */
export default function OrderSummary({ items, subtotal, count, variant, quote }: SummaryProps) {
  if (variant === "bar") {
    return (
      <details className="group rounded-lg border border-border bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-dark [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-1.5">
            Order summary ({count} item{count === 1 ? "" : "s"})
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </span>
          <span className="font-serif text-base">{formatINR(quote?.grandTotal ?? subtotal)}</span>
        </summary>
        <div className="px-4 pb-4">
          <Lines items={items} />
          <Totals subtotal={subtotal} quote={quote} />
        </div>
      </details>
    );
  }

  return (
    <aside aria-labelledby="summary-heading" className="hidden rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-28 lg:block">
      <h2 id="summary-heading" className="font-serif text-xl font-semibold text-dark">
        Order summary
      </h2>
      <p className="mb-2 text-sm text-muted">
        {count} item{count === 1 ? "" : "s"}
      </p>
      <Lines items={items} />
      <Totals subtotal={subtotal} quote={quote} />
    </aside>
  );
}
