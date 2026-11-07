import { CircleHelp, CreditCard, Package, RotateCcw, ShieldAlert, Truck, UserRound, type LucideIcon } from "lucide-react";
import type { SupportReason, SupportStatus } from "@/types/support";

/** How each reason is shown to the shopper. */
export const REASON_META: Record<SupportReason, { label: string; hint: string; icon: LucideIcon }> = {
  ORDER_ISSUE: { label: "Problem with my order", hint: "Wrong item, missing item, changes", icon: Package },
  DELIVERY: { label: "Delivery", hint: "Late, tracking, address", icon: Truck },
  PAYMENT: { label: "Payment", hint: "Charged but no order, failed payment", icon: CreditCard },
  RETURN_REFUND: { label: "Return or refund", hint: "Start a return, refund status", icon: RotateCcw },
  PRODUCT_QUALITY: { label: "Product quality", hint: "Damaged, defect, not as shown", icon: ShieldAlert },
  ACCOUNT: { label: "My account", hint: "Sign-in, profile, addresses", icon: UserRound },
  OTHER: { label: "Something else", hint: "Anything we haven't listed", icon: CircleHelp },
};

/** Order the reasons appear in the form. */
export const REASON_ORDER: SupportReason[] = [
  "ORDER_ISSUE",
  "DELIVERY",
  "PAYMENT",
  "RETURN_REFUND",
  "PRODUCT_QUALITY",
  "ACCOUNT",
  "OTHER",
];

const STATUS_META: Record<SupportStatus, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  IN_PROGRESS: { label: "In progress", className: "bg-sky-50 text-sky-800 ring-sky-200" },
  RESOLVED: { label: "Resolved", className: "bg-green-50 text-green-800 ring-green-200" },
  CLOSED: { label: "Closed", className: "bg-background text-muted ring-border" },
};

export function SupportStatusBadge({ status }: { status: SupportStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
