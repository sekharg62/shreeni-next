/**
 * GA4 ecommerce events, sent through Google Tag Manager's dataLayer.
 * GTM forwards them to GA4 (see the "GA4 – ecommerce events" tag in the container), which fills
 * Reports → Monetization → Ecommerce purchases (most viewed / added-to-cart products) and the checkout funnel.
 * Event and field names follow Google's spec: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

export type AnalyticsItem = {
  /** Product id (same item across sizes, so reports group by product). */
  productId?: string;
  name: string;
  /** Rupees, per piece. */
  price: number;
  quantity?: number;
  /** Size, e.g. "Free Size". */
  size?: string;
  /** Weave / category name, e.g. "Baluchori". */
  category?: string;
};

type EcommerceEvent =
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "add_shipping_info"
  | "add_payment_info"
  | "purchase";

const CURRENCY = "INR";

const toGa = (i: AnalyticsItem) => ({
  item_id: i.productId ?? i.name,
  item_name: i.name,
  price: i.price,
  quantity: i.quantity ?? 1,
  ...(i.size && { item_variant: i.size }),
  ...(i.category && { item_category: i.category }),
});

/** Push one ecommerce event. Safe to call anywhere on the client; does nothing on the server. */
export function trackEcommerce(event: EcommerceEvent, items: AnalyticsItem[], extra: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || items.length === 0) return;
  const value = items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
  // `window.dataLayer` is typed by @next/third-parties (Object[]).
  const dl = (window.dataLayer ??= []);
  // Clear the previous event's ecommerce object so fields don't leak between events (Google's recommendation).
  dl.push({ ecommerce: null });
  dl.push({
    event,
    ecommerce: { currency: CURRENCY, value: Math.round(value * 100) / 100, items: items.map(toGa), ...extra },
  });
}
