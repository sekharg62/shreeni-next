"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

type Props = {
  images: string[];
  name: string;
  /** Every size is sold out: a small label on the first photo (the photos stay full colour). */
  soldOut?: boolean;
};

/**
 * Desktop/tablet-landscape photos lay out as a lookbook: first photo full width, then pairs, and a
 * lone last photo full width again. Phones: the same photos as an edge-to-edge row with native
 * swipe (momentum + snap) and a segmented progress bar. Any photo opens the full-screen viewer.
 * One set of <img>s serves both layouts, so nothing is downloaded twice.
 */
export default function ProductGallery({ images, name, soldOut = false }: Props) {
  const [index, setIndex] = useState(0); // photo in view on phones
  const [zoomAt, setZoomAt] = useState<number | null>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const count = images.length;

  if (count === 0) {
    return (
      <div
        aria-hidden="true"
        className="-mx-4 flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-dark sm:-mx-6 lg:mx-0 lg:rounded-xl"
      >
        <span className="font-serif text-8xl font-semibold text-surface/80">{name.charAt(0)}</span>
      </div>
    );
  }

  /** Lookbook: photo 1 full width; then pairs; a lone last photo full width. */
  const isFull = (i: number) => i === 0 || (i === count - 1 && (count - 1) % 2 === 1);

  const onScroll = () => {
    const row = rowRef.current;
    if (!row || !row.clientWidth) return;
    const i = Math.round(row.scrollLeft / row.clientWidth);
    if (i !== index) setIndex(Math.min(count - 1, Math.max(0, i)));
  };

  const scrollTo = (i: number) => {
    const row = rowRef.current;
    if (row) row.scrollTo({ left: i * row.clientWidth, behavior: "smooth" });
  };

  return (
    // Phones: edge to edge (cancels the page's side padding). From 1024px: inside the column.
    <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
      <ul
        ref={rowRef}
        onScroll={onScroll}
        aria-label={`${name} photos`}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible"
      >
        {images.map((src, i) => {
          const full = isFull(i);
          return (
            <li
              key={src}
              className={`w-full shrink-0 snap-center snap-always lg:w-auto ${full ? "lg:col-span-2" : ""}`}
            >
              <button
                type="button"
                onClick={() => setZoomAt(i)}
                aria-label={`View photo ${i + 1} of ${count} full screen`}
                className="group/photo relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary lg:rounded-xl"
              >
                <Image
                  src={src}
                  alt={i === 0 ? name : `${name}, photo ${i + 1}`}
                  fill
                  sizes={full ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 1024px) 100vw, 28vw"}
                  preload={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  draggable={false}
                  className="object-cover transition-transform duration-[1200ms] ease-out lg:group-hover/photo:scale-[1.03] motion-reduce:transition-none"
                />
                {/* Desktop hint: appears on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-4 right-4 hidden h-10 w-10 items-center justify-center rounded-full bg-surface/85 text-dark opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 group-hover/photo:opacity-100 lg:flex"
                >
                  <Expand className="h-4 w-4" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {soldOut && (
        <span className="pointer-events-none absolute left-4 top-4 rounded-sm bg-surface/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-dark shadow-sm backdrop-blur-sm lg:left-5 lg:top-5">
          Sold out
        </span>
      )}

      {count > 1 && (
        // Phones only: "2 / 5" and a segmented bar; tap a segment to jump.
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-dark/45 to-transparent px-4 pb-3 pt-10 lg:hidden">
          <div className="pointer-events-auto flex flex-1 gap-1">
            {images.map((src, i) => (
              <button
                key={`seg-${src}`}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="h-4 flex-1 py-1.5"
              >
                <span
                  className={`block h-full rounded-full transition-colors duration-300 ${
                    i === index ? "bg-surface" : "bg-surface/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-medium tabular-nums text-surface">
            {index + 1} / {count}
          </span>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {count}
      </p>

      {zoomAt !== null && (
        <ImageLightbox
          images={images}
          name={name}
          index={zoomAt}
          onIndexChange={(i) => setZoomAt(((i % count) + count) % count)}
          onClose={() => {
            // Leave the phone row on the photo that was last viewed full screen.
            scrollTo(zoomAt);
            setZoomAt(null);
          }}
        />
      )}
    </div>
  );
}
