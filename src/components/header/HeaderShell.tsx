"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The sticky header box. Once the page is scrolled it sets `data-scrolled="true"`, which the
 * header uses (via `group-data-[scrolled=true]/hdr:`) to shrink, firm up its background and add
 * a soft shadow. Written straight to the DOM: no React re-render while scrolling.
 */
export default function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-scrolled="false"
      className="group/hdr sticky top-0 z-50 border-b border-border/70 bg-surface/90 backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-surface/95 data-[scrolled=true]:shadow-[0_10px_30px_-18px_rgba(50,21,27,0.45)]"
    >
      {children}
    </header>
  );
}
