"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  /** Upper limit (e.g. stock). Omit for no limit. */
  max?: number;
  size?: "sm" | "md";
};

export default function QuantityStepper({
  value,
  onChange,
  min = 0,
  max,
  size = "md",
}: QuantityStepperProps) {
  const btn = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const label = size === "sm" ? "w-7 text-sm" : "w-8 text-sm";

  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`flex ${btn} items-center justify-center text-dark transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Minus className={icon} aria-hidden="true" />
      </button>
      <span className={`${label} text-center font-semibold`} aria-live="polite" aria-label={`Quantity ${value}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
        className={`flex ${btn} items-center justify-center text-dark transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Plus className={icon} aria-hidden="true" />
      </button>
    </div>
  );
}
