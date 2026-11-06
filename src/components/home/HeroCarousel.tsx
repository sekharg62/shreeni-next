"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Banner } from "@/types/banner";

const AUTOPLAY_MS = 5000;
const SWIPE_PX = 50;

type Props = { banners: Banner[] };

/** Desktop image from 640px up, portrait crop below — only the matching one downloads. */
function BannerPicture({
  banner,
  first,
  load,
  mobileCrop,
}: {
  banner: Banner;
  /** the LCP image: fetched with high priority */
  first: boolean;
  /** fetch now (current / next slide) instead of waiting */
  load: boolean;
  mobileCrop: boolean;
}) {
  const common = { alt: banner.title ?? "", fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: banner.imageUrl });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: mobileCrop && banner.mobileImageUrl ? banner.mobileImageUrl : banner.imageUrl });

  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={desktop} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img
        {...img}
        srcSet={mobile}
        loading={first || load ? "eager" : "lazy"}
        fetchPriority={first ? "high" : "auto"}
        className="object-cover"
        draggable={false}
      />
    </picture>
  );
}

function SlideLink({ href, label, children }: { href: string | null; label: string; children: ReactNode }) {
  const cls = "absolute inset-0 block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-surface";
  if (!href) return <div className="absolute inset-0">{children}</div>;
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cls}>
      {children}
    </Link>
  );
}

const arrow =
  "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 text-dark shadow transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface sm:flex";

export default function HeroCarousel({ banners }: Props) {
  const count = banners.length;
  const multi = count > 1;
  // Portrait layout on phones only when every slide has a mobile crop; otherwise one shape for all.
  const mobileCrop = banners.every((b) => b.mobileImageUrl);

  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false); // pause button
  const [hoverPaused, setHoverPaused] = useState(false); // pointer over / focus inside
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    const onVisibility = () => setPageHidden(document.hidden);
    sync();
    mq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const playing = multi && !userPaused && !hoverPaused && !reducedMotion && !pageHidden;

  // One timer per slide, so manual navigation restarts the countdown.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, index, next]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!multi) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    pointerStartX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const start = pointerStartX.current;
    pointerStartX.current = null;
    if (!multi || start === null) return;
    const dx = e.clientX - start;
    if (dx <= -SWIPE_PX) next();
    else if (dx >= SWIPE_PX) prev();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverPaused(false);
      }}
      className={`relative w-full overflow-hidden bg-dark sm:aspect-[8/3] sm:max-h-[80vh] ${mobileCrop ? "aspect-[4/5]" : "aspect-[8/3]"}`}
    >
      <div
        className="flex h-full touch-pan-y transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointerStartX.current = null)}
      >
        {banners.map((b, i) => {
          const active = i === index;
          const label = b.title ?? `Banner ${i + 1}`;
          return (
            <div
              key={`${b.imageUrl}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              className="relative h-full w-full shrink-0"
            >
              <SlideLink href={b.linkUrl} label={label}>
                <BannerPicture
                  banner={b}
                  first={i === 0}
                  load={active || i === (index + 1) % count}
                  mobileCrop={mobileCrop}
                />
              </SlideLink>
            </div>
          );
        })}
      </div>

      {multi && (
        <>
          <button type="button" onClick={prev} aria-label="Previous slide" className={`${arrow} left-4`}>
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button type="button" onClick={next} aria-label="Next slide" className={`${arrow} right-4`}>
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-dark/30 px-2.5 py-1.5 backdrop-blur-sm sm:bottom-5 sm:right-5">
            {banners.map((b, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}${b.title ? `: ${b.title}` : ""}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-surface" : "w-1.5 bg-surface/50 hover:bg-surface/80"
                }`}
              />
            ))}
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-surface/90 hover:text-surface"
              >
                {userPaused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            )}
          </div>
        </>
      )}

      {/* Screen readers hear which slide is showing. */}
      <p className="sr-only" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        {multi ? `Slide ${index + 1} of ${count}${banners[index].title ? `: ${banners[index].title}` : ""}` : ""}
      </p>
    </section>
  );
}
