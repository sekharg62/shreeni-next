"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Smoothly animates its own height whenever the content inside changes size
 * (e.g. a field is added/removed). Wrap any region whose height should
 * transition instead of snapping.
 */
export default function AutoHeight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const update = () => setHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{ height }}
      className={`overflow-hidden transition-[height] duration-300 ease-out ${className}`}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}
