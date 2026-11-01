"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ⬇️ Replace these 5 placeholder URLs with your own image URLs.
const slides = [
  "https://picsum.photos/seed/shreeni-1/1600/900",
  "https://picsum.photos/seed/shreeni-2/1600/900",
  "https://picsum.photos/seed/shreeni-3/1600/900",
  "https://picsum.photos/seed/shreeni-4/1600/900",
  "https://picsum.photos/seed/shreeni-5/1600/900",
];

const AUTOPLAY_MS = 4000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const goTo = useCallback((i: number) => setIndex((i + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Auto-slide; resets whenever `index` changes (so manual nav restarts the timer).
  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, index]);

  return (
    <section
      className="relative h-[60vh] min-h-[380px] w-full overflow-hidden bg-dark sm:h-[70vh]"
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      {/* Sliding track */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              alt={`Slide ${i + 1}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Left / right chevrons */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 text-dark shadow transition hover:bg-surface"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 text-dark shadow transition hover:bg-surface"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Dots — bottom right */}
      <div className="absolute bottom-5 right-5 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-5 bg-surface"
                : "w-1.5 bg-surface/50 hover:bg-surface/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
