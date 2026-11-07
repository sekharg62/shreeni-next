/** Backend money is integer paise; the UI works in rupees. */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

/** 3499 → "₹3,499"; 3499.5 → "₹3,499.5" */
export function formatINR(rupees: number): string {
  return inr.format(rupees);
}

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const relFmt = new Intl.RelativeTimeFormat("en-IN", { numeric: "auto" });

/** "7 Nov 2026" */
export function formatDate(value: string | Date): string {
  return dateFmt.format(new Date(value));
}

/** "7 Nov 2026, 3:45 pm" */
export function formatDateTime(value: string | Date): string {
  const d = new Date(value);
  return `${dateFmt.format(d)}, ${timeFmt.format(d)}`;
}

/** "just now", "5 minutes ago", "yesterday", then a date after a week. */
export function formatRelative(value: string | Date, now: number = Date.now()): string {
  const seconds = Math.round((new Date(value).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  if (abs < 3600) return relFmt.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return relFmt.format(Math.round(seconds / 3600), "hour");
  if (abs < 7 * 86400) return relFmt.format(Math.round(seconds / 86400), "day");
  return formatDate(value);
}
