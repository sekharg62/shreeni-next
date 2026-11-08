import type { PageMeta } from "./api";
import type { AddressInput } from "./address";
import type { CartItemInput, CartLineDto } from "./cart";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
export type PaymentStatus = "CREATED" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentOption = "TEST";

/* ───────────── API bodies (amounts in paise) ───────────── */

export type CheckoutQuoteDto = {
  items: CartLineDto[];
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  grandTotal: number;
  coupon: { code: string; description: string | null; discount: number } | null;
  couponError: string | null;
  canPlaceOrder: boolean;
  paymentOptions: { value: PaymentOption; label: string }[];
};

type OrderItemDto = {
  name: string;
  slug: string | null;
  size: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDetailDto = {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  items: OrderItemDto[];
  itemCount: number;
  subtotal: number;
  discountCode: string | null;
  discountTotal: number;
  shippingTotal: number;
  grandTotal: number;
  contactEmail: string | null;
  contactPhone: string;
  shippingAddress: OrderAddress;
  payment: { method: "PREPAID" | "COD"; provider: string; status: PaymentStatus; amount: number; paidAt: string | null } | null;
  shipment: OrderShipment | null;
  timeline: OrderEvent[];
  cancelledAt: string | null;
  cancelReason: string | null;
  canCancel: boolean;
};

export type OrderSummaryDto = {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  grandTotal: number;
  itemCount: number;
  previewItems: OrderItemDto[];
};

export type PlaceOrderBody = {
  items: CartItemInput[];
  couponCode?: string;
  paymentMethod: PaymentOption;
  idempotencyKey: string;
  /** Signed in: one of the saved addresses. */
  addressId?: string;
  /** Guest: contact + address. */
  guest?: { email: string; phone: string; address: AddressInput };
};

/* ───────────── UI models (amounts in rupees) ───────────── */

export type OrderAddress = {
  receiverName: string;
  receiverPhone: string;
  flatHouseNo: string;
  apartmentSector: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type OrderShipment = {
  deliveryPartner: string;
  awb: string | null;
  status: string;
  shippedAt: string | null;
  deliveredAt: string | null;
};

export type OrderEvent = { status: OrderStatus; label: string; note: string | null; at: string };

export type OrderItem = Omit<OrderItemDto, "unitPrice" | "lineTotal"> & { unitPrice: number; lineTotal: number };

export type OrderDetail = Omit<OrderDetailDto, "items" | "subtotal" | "discountTotal" | "shippingTotal" | "grandTotal" | "payment"> & {
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  grandTotal: number;
  payment: (Omit<NonNullable<OrderDetailDto["payment"]>, "amount"> & { amount: number }) | null;
};

export type OrderSummary = Omit<OrderSummaryDto, "grandTotal" | "previewItems"> & { grandTotal: number; previewItems: OrderItem[] };

export type OrderPage = { data: OrderSummary[]; meta: PageMeta };

export type CheckoutQuote = {
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  grandTotal: number;
  coupon: { code: string; description: string | null; discount: number } | null;
  couponError: string | null;
  canPlaceOrder: boolean;
  paymentOptions: { value: PaymentOption; label: string }[];
};
