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
