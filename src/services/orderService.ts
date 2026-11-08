import { apiClient, authApiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { paiseToRupees as rs } from "@/lib/format";
import type { Paginated } from "@/types/api";
import type { CartItemInput } from "@/types/cart";
import type {
  CheckoutQuote,
  CheckoutQuoteDto,
  OrderDetail,
  OrderDetailDto,
  OrderPage,
  OrderSummary,
  OrderSummaryDto,
  PlaceOrderBody,
} from "@/types/order";

/* Backend amounts are paise; everything here hands rupees to the UI. */

const toItem = <T extends { unitPrice: number; lineTotal: number }>(i: T): T => ({
  ...i,
  unitPrice: rs(i.unitPrice),
  lineTotal: rs(i.lineTotal),
});

export function toOrderDetail(o: OrderDetailDto): OrderDetail {
  return {
    ...o,
    items: o.items.map(toItem),
    subtotal: rs(o.subtotal),
    discountTotal: rs(o.discountTotal),
    shippingTotal: rs(o.shippingTotal),
    grandTotal: rs(o.grandTotal),
    payment: o.payment && { ...o.payment, amount: rs(o.payment.amount) },
  };
}

const toSummary = (o: OrderSummaryDto): OrderSummary => ({
  ...o,
  grandTotal: rs(o.grandTotal),
  previewItems: o.previewItems.map(toItem),
});

const toQuote = (q: CheckoutQuoteDto): CheckoutQuote => ({
  subtotal: rs(q.subtotal),
  discountTotal: rs(q.discountTotal),
  shippingTotal: rs(q.shippingTotal),
  grandTotal: rs(q.grandTotal),
  coupon: q.coupon && { ...q.coupon, discount: rs(q.coupon.discount) },
  couponError: q.couponError,
  canPlaceOrder: q.canPlaceOrder,
  paymentOptions: q.paymentOptions,
});

/** Checkout, order placement, guest tracking and the signed-in customer's orders. */
export const orderService = {
  /** Totals and coupon check. Sends the sign-in token when there is one (per-customer coupon limits). */
  async quote(items: CartItemInput[], couponCode?: string): Promise<CheckoutQuote> {
    const { data } = await authApiClient.post<CheckoutQuoteDto>(ENDPOINTS.orders.quote, { items, couponCode });
    return toQuote(data);
  },

  async place(body: PlaceOrderBody): Promise<OrderDetail> {
    const { data } = await authApiClient.post<OrderDetailDto>(ENDPOINTS.orders.place, body);
    return toOrderDetail(data);
  },

  async track(orderNumber: string, contact: string): Promise<OrderDetail> {
    const { data } = await apiClient.post<OrderDetailDto>(ENDPOINTS.orders.track, { orderNumber, contact });
    return toOrderDetail(data);
  },

  async mine(page = 1, limit = 10): Promise<OrderPage> {
    const { data } = await authApiClient.get<Paginated<OrderSummaryDto>>(ENDPOINTS.orders.mine, { params: { page, limit } });
    return { data: data.data.map(toSummary), meta: data.meta };
  },

  async get(orderNumber: string): Promise<OrderDetail> {
    const { data } = await authApiClient.get<OrderDetailDto>(ENDPOINTS.orders.one(orderNumber));
    return toOrderDetail(data);
  },

  async cancel(orderNumber: string, reason?: string): Promise<OrderDetail> {
    const { data } = await authApiClient.post<OrderDetailDto>(ENDPOINTS.orders.cancel(orderNumber), { reason });
    return toOrderDetail(data);
  },
};
