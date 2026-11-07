"use client";

import { useState, type KeyboardEvent } from "react";
import { Star } from "lucide-react";

const SIZES = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" } as const;

/** Read-only stars; fractional values fill part of a star (4.6 → 4 full + 60%). */
export function Stars({ value, size = "sm", label }: { value: number; size?: keyof typeof SIZES; label?: string }) {
  const cls = SIZES[size];
  return (
    <span role="img" aria-label={label ?? `${value} out of 5 stars`} className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className={`relative inline-block ${cls}`} aria-hidden="true">
            <Star className={`absolute inset-0 ${cls} text-secondary/35`} strokeWidth={1.5} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${cls} fill-secondary text-secondary`} strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"] as const;

type InputProps = {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  invalid?: boolean;
  describedBy?: string;
};

/** Star picker: click/tap, or arrow keys inside the group (a radio group). */
export function StarInput({ value, onChange, id, invalid, describedBy }: InputProps) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(1, (value || 2) - 1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        id={id}
        role="radiogroup"
        aria-label="Your rating"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onKeyDown={onKey}
        onMouseLeave={() => setHover(0)}
        className="inline-flex gap-1"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""} — ${RATING_LABELS[n]}`}
            // Only the selected star (or the first) is in the tab order; arrows move between them.
            tabIndex={value ? (value === n ? 0 : -1) : n === 1 ? 0 : -1}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Star
              className={`h-8 w-8 ${n <= shown ? "fill-secondary text-secondary" : invalid ? "text-red-400" : "text-secondary/40"}`}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <span className="min-w-20 text-sm font-medium text-dark" aria-live="polite">
        {RATING_LABELS[shown] ?? ""}
      </span>
    </div>
  );
}
