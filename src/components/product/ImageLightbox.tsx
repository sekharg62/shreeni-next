"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const SWIPE_PX = 50;

type Props = {
  images: string[];
  name: string;
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

/** Full-screen photo viewer. Click outside the photo, press Esc or the × to close. */
export default function ImageLightbox({ images, name, index, onIndexChange, onClose }: Props) {
  const count = images.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const startX = useRef<number | null>(null);
  const go = (i: number) => onIndexChange(((i % count) + count) % count);

  // Lock page scroll and move focus into the dialog; restore both on close.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);

  // Esc closes, arrow keys move between photos. Stop propagation: React events
  // bubble through the portal to the gallery, which would otherwise step twice.
  const onKey = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowRight" && count > 1) go(index + 1);
    else if (e.key === "ArrowLeft" && count > 1) go(index - 1);
  };
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

  const onDown = (e: PointerEvent) => (startX.current = e.clientX);
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (count < 2) return;
    if (dx <= -SWIPE_PX) go(index + 1);
    else if (dx >= SWIPE_PX) go(index - 1);
  };

  const control =
    "flex h-12 w-12 items-center justify-center rounded-full bg-surface/10 text-surface ring-1 ring-surface/20 backdrop-blur transition hover:bg-surface/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photos`}
      tabIndex={-1}
      onKeyDown={onKey}
      onPointerDown={stop}
      onPointerUp={stop}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-dark/95 p-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={images[index]}
        src={images[index]}
        alt={index === 0 ? name : `${name} — photo ${index + 1}`}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (startX.current = null)}
        className="max-h-[calc(100dvh-7rem)] max-w-full touch-pan-y select-none rounded-md object-contain shadow-2xl"
      />

      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        {count > 1 && (
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className={control}>
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={control}>
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
        {count > 1 && (
          <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className={control}>
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {count > 1 && (
        <p className="text-xs font-medium text-surface/70" aria-live="polite">
          {index + 1} / {count}
        </p>
      )}
    </div>,
    document.body,
  );
}
