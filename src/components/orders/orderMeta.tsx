import type { OrderStatus } from "@/types/order";

/** How each status is shown to shoppers. */
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Awaiting payment", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-sky-50 text-sky-800 ring-sky-200" },
  PACKED: { label: "Packed", className: "bg-indigo-50 text-indigo-800 ring-indigo-200" },
  SHIPPED: { label: "Shipped", className: "bg-violet-50 text-violet-800 ring-violet-200" },
  DELIVERED: { label: "Delivered", className: "bg-green-50 text-green-800 ring-green-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 ring-red-200" },
  RETURNED: { label: "Returned", className: "bg-background text-muted ring-border" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${meta.className}`}>
      {meta.label}
    </span>
  );
}

/** "OD261108482913" is long: show it in groups on screen (copy keeps the plain number). */
export const spacedOrderNumber = (n: string) => n.replace(/^(OD)(\d{6})(\d{6})$/, "$1 $2 $3");
