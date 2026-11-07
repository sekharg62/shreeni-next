"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

const SWIPE_PX = 50;
/** Movement below this counts as a tap (opens the full-screen view). */
const TAP_PX = 8;

type Props = { images: string[]; name: string };

/** Main photo + thumbnails. Swipe on phones, arrows and keys on desktop. */
export default function ProductGallery({ images, name }: Props) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const startX = useRef<number | null>(null);
  const count = images.length;

  if (count === 0) {
    return (
      <div
        aria-hidden="true"
        className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary/90 via-primary to-dark"
      >
        <span className="font-serif text-8xl font-semibold text-surface/80">{name.charAt(0)}</span>
      </div>
    );
  }

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "Enter" && e.target === e.currentTarget) setZoomed(true);
  };
  const onDown = (e: PointerEvent) => (startX.current = e.clientX);
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx <= -SWIPE_PX) go(index + 1);
    else if (dx >= SWIPE_PX) go(index - 1);
    // A tap on the photo itself (not the arrow buttons) opens the full-screen view.
    else if (Math.abs(dx) < TAP_PX && !(e.target as HTMLElement).closest("button")) setZoomed(true);
  };

  const arrow =
    "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-dark shadow transition hover:bg-surface sm:flex";

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (startX.current = null)}
        title="Click to view full screen"
        className="relative aspect-[3/4] w-full cursor-zoom-in touch-pan-y overflow-hidden rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex-1"
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? name : `${name} — photo ${i + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            preload={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            draggable={false}
            aria-hidden={i !== index}
            className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className={`${arrow} left-3`}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className={`${arrow} right-3`}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-dark/60 px-2.5 py-1 text-xs font-medium text-surface sm:hidden">
              {index + 1} / {count}
            </span>
          </>
        )}
        <p className="sr-only" aria-live="polite">
          Photo {index + 1} of {count}
        </p>
      </div>

      {count > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative block aspect-[3/4] w-16 overflow-hidden rounded-md border-2 transition-colors lg:w-20 ${
                  i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoomed && (
        <ImageLightbox images={images} name={name} index={index} onIndexChange={go} onClose={() => setZoomed(false)} />
      )}
    </div>
  );
}
