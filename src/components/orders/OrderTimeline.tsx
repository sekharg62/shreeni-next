import { Check, X } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { OrderEvent, OrderStatus } from "@/types/order";

/** The normal journey of an order. */
const FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

const STEP_LABEL: Record<OrderStatus, string> = {
  PENDING: "Order placed",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

type Step = { status: OrderStatus; event?: OrderEvent; state: "done" | "current" | "upcoming" | "stopped" };

function stepsFor(status: OrderStatus, events: OrderEvent[]): Step[] {
  const latest = new Map<OrderStatus, OrderEvent>();
  for (const e of events) latest.set(e.status, e);

  // Cancelled / returned: show what actually happened, ending with the stop.
  if (status === "CANCELLED" || status === "RETURNED") {
    const happened = FLOW.filter((s) => latest.has(s)).map<Step>((s) => ({ status: s, event: latest.get(s), state: "done" }));
    return [...happened, { status, event: latest.get(status), state: "stopped" }];
  }
  const at = FLOW.indexOf(status);
  return FLOW.map((s, i) => ({
    status: s,
    event: latest.get(s),
    state: i < at ? "done" : i === at ? (s === "DELIVERED" ? "done" : "current") : "upcoming",
  }));
}

/** Vertical tracking timeline: what has happened (with dates and notes) and what comes next. */
export default function OrderTimeline({ status, events }: { status: OrderStatus; events: OrderEvent[] }) {
  const steps = stepsFor(status, events);
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const reached = step.state !== "upcoming";
        return (
          <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-0.5 ${steps[i + 1].state === "upcoming" ? "bg-border" : "bg-primary"}`}
              />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                step.state === "stopped"
                  ? "bg-red-600 text-surface"
                  : step.state === "upcoming"
                    ? "border-2 border-border bg-surface"
                    : step.state === "current"
                      ? "bg-primary text-surface ring-4 ring-primary/15"
                      : "bg-primary text-surface"
              }`}
            >
              {step.state === "stopped" ? (
                <X className="h-4 w-4" />
              ) : step.state === "upcoming" ? null : step.state === "current" ? (
                <span className="h-2 w-2 rounded-full bg-surface" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={`text-sm font-semibold ${reached ? (step.state === "stopped" ? "text-red-700" : "text-dark") : "text-muted"}`}>
                {STEP_LABEL[step.status]}
                <span className="sr-only">{step.state === "upcoming" ? " (not yet)" : step.state === "current" ? " (current step)" : ""}</span>
              </p>
              {step.event && <p className="text-xs text-muted">{formatDateTime(step.event.at)}</p>}
              {step.event?.note && step.event.note !== "Order placed" && <p className="mt-1 text-sm text-dark/80">{step.event.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
