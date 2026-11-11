"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { useTesterMode } from "@/lib/testerMode";

type Message = {
  text: string;
  /** Shown instead on phones when `text` is too long for one line. */
  short?: string;
  highlight?: boolean;
};

const PROMOS: Message[] = [
  { text: "Free shipping on all orders above ₹1999" },
  { text: "Flat 10% off your first purchase — code SHREENI10", short: "10% off your first order — SHREENI10" },
  { text: "Handpicked authentic weaves, delivered across India", short: "Authentic weaves, delivered across India" },
  { text: "Easy 7-day returns & exchange" },
];

/** Each message stays this long before the next slides in. */
const ROTATE_MS = 4500;

/**
 * One slim strip above the header. Shows one message at a time and slides to the next;
 * pauses while hovered or focused, and has arrows to step through by hand. While the store is
 * in preview, the "launching soon" note is the first message. Mounted on every page, so
 * `?tester=1` (tester mode) works from any URL.
 */
export default function AnnouncementBar() {
  const tester = useTesterMode();
  const messages: Message[] = siteConfig.launch.preview
    ? [{ text: siteConfig.launch.message, short: "Launching soon — orders open shortly", highlight: true }, ...PROMOS]
    : PROMOS;
  const count = messages.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setTimeout(() => step(1), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, count, step]);

  const arrow =
    "hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-surface/60 transition-colors hover:bg-surface/10 hover:text-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary sm:flex";

  return (
    <div
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative bg-dark text-surface"
    >
      <div className="mx-auto flex h-9 max-w-[1440px] items-center gap-2 px-2 sm:px-6 lg:px-8">
        <button type="button" onClick={() => step(-1)} aria-label="Previous announcement" className={arrow}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* All messages stacked; the current one slides into place. */}
        <div className="relative h-full flex-1 overflow-hidden">
          {messages.map((m, i) => {
            const offset = (i - index + count) % count;
            const state = offset === 0 ? "current" : offset === count - 1 ? "previous" : "next";
            return (
              <p
                key={m.text}
                aria-hidden={state !== "current"}
                className={`absolute inset-0 flex items-center justify-center gap-2 truncate px-2 text-center text-[11px] font-medium tracking-[0.08em] transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none sm:text-xs ${
                  state === "current"
                    ? "translate-y-0 opacity-100"
                    : state === "previous"
                      ? "-translate-y-full opacity-0"
                      : "translate-y-full opacity-0"
                } ${m.highlight ? "text-secondary" : "text-surface/90"}`}
              >
                {m.highlight ? (
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 rotate-45 bg-secondary" />
                )}
                {m.short ? (
                  <>
                    <span className="truncate sm:hidden">{m.short}</span>
                    <span className="hidden truncate sm:inline">{m.text}</span>
                  </>
                ) : (
                  <span className="truncate">{m.text}</span>
                )}
                {m.highlight && tester && (
                  <span className="shrink-0 rounded bg-surface/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-surface">
                    Tester mode
                  </span>
                )}
              </p>
            );
          })}
        </div>

        <button type="button" onClick={() => step(1)} aria-label="Next announcement" className={arrow}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {/* hairline of gold under the strip */}
      <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
    </div>
  );
}
