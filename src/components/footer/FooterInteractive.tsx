"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Jaal: the curved ogee lattice of Baluchori / Jamdani sarees, with a small lotus knot where the
 * lines cross. One tile, repeated. Drawn twice by FooterPattern: faint everywhere, and bright
 * inside the pointer's spotlight.
 */
function Jaal({ id, className }: { id: string; className: string }) {
  return (
    <svg aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="64" height="88" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
            <path d="M0 0 C0 22 32 22 32 44 C32 66 64 66 64 88" />
            <path d="M64 0 C64 22 32 22 32 44 C32 66 0 66 0 88" />
            {/* inner echo line: gives the lattice its woven, doubled look */}
            <path d="M6 0 C6 18 32 24 32 38" opacity="0.5" />
            <path d="M58 0 C58 18 32 24 32 38" opacity="0.5" />
            <path d="M32 50 C32 64 6 70 6 88" opacity="0.5" />
            <path d="M32 50 C32 64 58 70 58 88" opacity="0.5" />
          </g>
          {/* lotus knot at the crossing */}
          <g fill="currentColor" transform="translate(32 44)">
            <ellipse rx="1.6" ry="4.2" />
            <ellipse rx="1.3" ry="3.4" transform="rotate(-40)" opacity="0.8" />
            <ellipse rx="1.3" ry="3.4" transform="rotate(40)" opacity="0.8" />
            <circle r="1.1" fill="#32151b" />
          </g>
          {/* small seeds at the tile corners */}
          <g fill="currentColor" opacity="0.7">
            <circle cx="0" cy="0" r="1.6" />
            <circle cx="64" cy="0" r="1.6" />
            <circle cx="0" cy="88" r="1.6" />
            <circle cx="64" cy="88" r="1.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Bright layer is visible only in a soft circle around the pointer (position from CSS variables). */
const SPOTLIGHT_MASK =
  "radial-gradient(circle 220px at var(--fx, 50%) var(--fy, -999px), #000 0%, rgba(0,0,0,0.45) 45%, transparent 75%)";

/**
 * The footer's background: a faint gold jaal, and a soft spotlight that follows the mouse and
 * brings the pattern out in full gold where it passes. Pointer position is written straight into
 * CSS variables (no React re-render). Off on touch screens and for reduced motion.
 */
export function FooterPattern() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      layer.style.setProperty("--fx", `${x}px`);
      layer.style.setProperty("--fy", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      layer.dataset.lit = "true";
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    const onLeave = () => {
      layer.dataset.lit = "false";
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" data-lit="false" className="group/fp pointer-events-none absolute inset-0 overflow-hidden">
      {/* faint, always there */}
      <Jaal id="footer-jaal" className="text-secondary opacity-[0.07]" />
      {/* bright gold, only inside the spotlight */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[lit=true]/fp:opacity-100 motion-reduce:hidden"
        style={{ maskImage: SPOTLIGHT_MASK, WebkitMaskImage: SPOTLIGHT_MASK }}
      >
        <Jaal id="footer-jaal-lit" className="text-secondary opacity-60" />
      </div>
      {/* warm glow at the top edge, like light on silk */}
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(184,134,70,0.16),transparent_70%)]" />
    </div>
  );
}

/** "Back to top": smooth scroll (instant for reduced motion). */
export function BackToTopLink() {
  return (
    <button
      type="button"
      onClick={() => {
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
      }}
      className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-background/70 transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    >
      Back to top
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-secondary/50 transition duration-300 group-hover:-translate-y-0.5 group-hover:border-secondary group-hover:bg-secondary group-hover:text-dark">
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </button>
  );
}
