import type { OrderDetail } from "@/types/order";

/**
 * The order just placed, kept in this tab so the confirmation page can show it to guests
 * (who have no account to load it from). Survives a reload; gone when the tab closes.
 */
const KEY = "shreeni_last_order";
/** Marks orders already reported to analytics, so a reload doesn't count a purchase twice. */
const TRACKED_KEY = "shreeni_tracked_orders";

export function saveLastOrder(order: OrderDetail) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* storage blocked: the page falls back to tracking by order ID */
  }
}

export function readLastOrder(orderNumber: string): OrderDetail | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const order = raw ? (JSON.parse(raw) as OrderDetail) : null;
    return order?.orderNumber === orderNumber ? order : null;
  } catch {
    return null;
  }
}

/** true the first time it's called for an order (in this browser). */
export function firstTimeTracked(orderNumber: string): boolean {
  try {
    const seen = JSON.parse(window.localStorage.getItem(TRACKED_KEY) ?? "[]") as string[];
    if (seen.includes(orderNumber)) return false;
    window.localStorage.setItem(TRACKED_KEY, JSON.stringify([...seen.slice(-19), orderNumber]));
    return true;
  } catch {
    return true;
  }
}
