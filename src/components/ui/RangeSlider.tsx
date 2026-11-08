"use client";

import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Props = {
  /** Lowest and highest selectable values. */
  min: number;
  max: number;
  /** Distance between selectable values (also the smallest gap between the two handles). */
  step?: number;
  /** Selected [low, high]. Read when the component mounts; remount (change its `key`) to reset it. */
  value: [number, number];
  /** Called once the shopper lets go of a handle (or presses an arrow key), with the new [low, high]. */
  onCommit: (value: [number, number]) => void;
  /** Turns a value into text, e.g. 1500 → "₹1,500". */
  format?: (n: number) => string;
  /** Accessible names for the two handles. */
  labels?: [string, string];
  /** Show "+" after the high value when it sits at the top end ("₹4,800+" = and above). */
  openEnded?: boolean;
  className?: string;
};

/**
 * Two-handle range slider. Built from two overlaid native range inputs (styled by `.range-thumb`
 * in globals.css), so arrow keys, touch and screen readers work out of the box.
 * Updates live while dragging; reports through `onCommit` only on release, so callers can
 * run one search per adjustment instead of one per pixel.
 */
export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onCommit,
  format = String,
  labels = ["Minimum", "Maximum"],
  openEnded = false,
  className = "",
}: Props) {
  const id = useId();
  const span = Math.max(step, max - min);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const [range, setRangeState] = useState<[number, number]>([clamp(value[0]), clamp(value[1])]);
  // Release events can fire before React re-renders with the last drag value, so commits read this ref.
  const latest = useRef(range);
  const committed = useRef(range);
  const setRange = (next: [number, number]) => {
    latest.current = next;
    setRangeState(next);
  };
  const [low, high] = range;
  const pct = (n: number) => ((n - min) / span) * 100;

  const commit = () => {
    const next = latest.current;
    if (next[0] === committed.current[0] && next[1] === committed.current[1]) return;
    committed.current = next;
    onCommit(next);
  };
  const commitEvents = {
    onPointerUp: (e: ReactPointerEvent<HTMLInputElement>) => {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      commit();
    },
    onKeyUp: commit,
    onBlur: commit,
  };

  return (
    <div className={className}>
      <p className="mb-4 text-sm font-medium tabular-nums text-dark" aria-live="polite">
        {format(low)} – {format(high)}
        {openEnded && high === max && "+"}
      </p>
      <div className="relative h-6">
        {/* Track + selected part are decoration only: clicks pass through to the handles. */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }}
        />
        <input
          id={`${id}-low`}
          type="range"
          aria-label={labels[0]}
          min={min}
          max={max}
          step={step}
          value={low}
          aria-valuetext={format(low)}
          onChange={(e) => setRange([Math.min(Number(e.target.value), high - step), high])}
          {...commitEvents}
          // When both handles reach the top end, the low one must be on top to stay draggable.
          className={`range-thumb ${low > max - step * 2 ? "z-20" : "z-10"}`}
        />
        <input
          id={`${id}-high`}
          type="range"
          aria-label={labels[1]}
          min={min}
          max={max}
          step={step}
          value={high}
          aria-valuetext={format(high)}
          onChange={(e) => setRange([low, Math.max(Number(e.target.value), low + step)])}
          {...commitEvents}
          className="range-thumb z-10"
        />
      </div>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-muted" aria-hidden="true">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
