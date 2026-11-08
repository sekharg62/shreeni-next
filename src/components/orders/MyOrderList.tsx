"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, CloudOff, Loader2, Package, RotateCw } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api";
import { formatDate, formatINR } from "@/lib/format";
import { orderService } from "@/services/orderService";
import type { OrderSummary } from "@/types/order";
import { OrderStatusBadge, spacedOrderNumber } from "./orderMeta";

const PAGE_SIZE = 10;

export function OrderListSkeleton() {
  return (
    <ul aria-hidden="true" className="space-y-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex gap-4 rounded-lg border border-border bg-surface p-5">
          <div className="h-20 w-16 animate-pulse rounded-md bg-background" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-1/3 animate-pulse rounded bg-background" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-background" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-background" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The signed-in customer's orders, newest first, with "Load more". */
export default function MyOrderList() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState<"loading" | "ready" | "error" | "more">("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((p: number) => {
    setState(p === 1 ? "loading" : "more");
    orderService.mine(p, PAGE_SIZE).then(
      (res) => {
        setOrders((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
        setPage(res.meta.page);
        setTotalPages(res.meta.totalPages);
        setState("ready");
      },
      (err: unknown) => {
        setError(getApiErrorMessage(err, "We couldn't load your orders."));
        setState("error");
      },
    );
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => load(1));
  }, [load]);

  if (state === "loading") return <OrderListSkeleton />;

  if (state === "error" && orders.length === 0) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center">
        <CloudOff className="h-8 w-8 text-red-600" aria-hidden="true" />
        <p className="font-medium text-dark">{error}</p>
        <button
          type="button"
          onClick={() => load(1)}
          className="inline-flex items-center gap-2 rounded-full border border-dark px-5 py-2 text-xs font-semibold uppercase tracking-wider text-dark transition-colors hover:bg-dark hover:text-surface"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
          <Package className="h-8 w-8 text-primary/60" aria-hidden="true" />
        </span>
        <p className="font-serif text-lg font-semibold text-dark">No orders yet</p>
        <p className="max-w-sm text-sm text-muted">When you place an order, you can follow it here — from confirmation to your doorstep.</p>
        <Link
          href="/sarees"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {orders.map((o) => {
          const more = o.itemCount - o.previewItems.reduce((n, i) => n + i.quantity, 0);
          return (
            <li key={o.orderNumber}>
              <Link
                href={`/account/orders/${o.orderNumber}`}
                className={`group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-5 ${
                  o.status === "CANCELLED" ? "opacity-75" : ""
                }`}
              >
                <div className="flex shrink-0 -space-x-6">
                  {o.previewItems.slice(0, 2).map((i, idx) => (
                    <div key={idx} className="h-20 w-16 overflow-hidden rounded-md border-2 border-surface bg-background shadow-sm">
                      {i.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={i.image} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <OrderStatusBadge status={o.status} />
                    <span className="text-xs text-muted">{formatDate(o.placedAt)}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-sm font-medium text-dark">
                    {o.previewItems[0]?.name}
                    {(o.previewItems.length > 1 || more > 0) && (
                      <span className="text-muted"> + {o.itemCount - (o.previewItems[0]?.quantity ?? 0)} more</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    <span className="font-mono">{spacedOrderNumber(o.orderNumber)}</span> · {formatINR(o.grandTotal)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>

      {page < totalPages && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => load(page + 1)}
            disabled={state === "more"}
            className="inline-flex items-center gap-2 rounded-full border border-dark px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-dark transition-colors hover:bg-dark hover:text-surface disabled:opacity-60"
          >
            {state === "more" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Load more
          </button>
        </div>
      )}
    </>
  );
}
