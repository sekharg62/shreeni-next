"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Banner } from "@/types/banner";

const AUTOPLAY_MS = 6000;
const SWIPE_PX = 50;
/** Crossfade length. The slow zoom runs a little longer than one slide's time on screen. */
const FADE_MS = 1100;
const ZOOM_MS = AUTOPLAY_MS + FADE_MS;
/** Banner is inset on desktop: at most the 1440px container minus its side padding. */
const BANNER_SIZES = "(min-width: 1440px) 1376px, (min-width: 1024px) calc(100vw - 4rem), (min-width: 640px) calc(100vw - 3rem), 100vw";

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
  const common = { alt: banner.title ?? "", fill: true, sizes: BANNER_SIZES } as const;
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

// Desktop: arrows fade in when the pointer is over the banner (always there for keyboard focus).
const arrow =
  "absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-surface/40 bg-dark/25 text-surface backdrop-blur-md transition duration-300 hover:bg-surface hover:text-dark focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface sm:flex sm:opacity-0 sm:group-hover:opacity-100";

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
  // The first slide starts its slow zoom after hydration (server HTML shows it at rest).
  const [mounted, setMounted] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    const onVisibility = () => setPageHidden(document.hidden);
    sync();
    // Next frame, so the browser paints the zoomed-in start before the zoom transition begins.
    const raf = window.requestAnimationFrame(() => setMounted(true));
    mq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(raf);
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
    // Phones: edge to edge. Desktop: inset inside the page width, with rounded corners.
    <div className="mx-auto w-full max-w-[1440px] sm:px-6 sm:pt-4 lg:px-8 lg:pt-6">
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
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (pointerStartX.current = null)}
      className={`group relative w-full touch-pan-y overflow-hidden bg-dark sm:aspect-[8/3] sm:max-h-[75vh] sm:rounded-2xl sm:shadow-[0_18px_50px_-20px_rgba(50,21,27,0.55)] sm:ring-1 sm:ring-secondary/25 ${mobileCrop ? "aspect-[4/5]" : "aspect-[8/3]"}`}
    >
      {/* Slides stacked: the active one fades in over the last while slowly zooming out. */}
      {banners.map((b, i) => {
        const active = i === index;
        const label = b.title ?? `Banner ${i + 1}`;
        const zoomed = !reducedMotion && (!active || !mounted);
        return (
          <div
            key={`${b.imageUrl}-${i}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 ${active ? "z-10 opacity-100" : "z-0 opacity-0"}`}
            style={{
              // Incoming fades in on top; outgoing stays fully visible underneath until that's done,
              // so the dark background never shows through mid-fade.
              transition: reducedMotion
                ? "none"
                : active
                  ? `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
                  : `opacity 0s linear ${FADE_MS}ms`,
            }}
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: zoomed ? "scale(1.07)" : "scale(1)",
                // Active: drift slowly to rest. Leaving: hold still, then reset once it's faded out.
                transition: reducedMotion
                  ? "none"
                  : active
                    ? `transform ${ZOOM_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
                    : `transform 0s linear ${FADE_MS}ms`,
              }}
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
          </div>
        );
      })}

      {/* Soft shade at the bottom so the controls read on any image. */}
      {multi && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-dark/40 to-transparent"
        />
      )}

      {multi && (
        <>
          <button type="button" onClick={prev} aria-label="Previous slide" className={`${arrow} left-5 lg:left-6`}>
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button type="button" onClick={next} aria-label="Next slide" className={`${arrow} right-5 lg:right-6`}>
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-dark/30 px-3 py-1.5 backdrop-blur-sm sm:bottom-5">
            {banners.map((b, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}${b.title ? `: ${b.title}` : ""}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-out ${
                  i === index ? "w-8 bg-surface/35" : "w-1.5 bg-surface/50 hover:bg-surface/80"
                }`}
              >
                {/* Active dot fills up while the slide is on screen. */}
                {i === index && (
                  <span
                    key={index}
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 rounded-full bg-surface ${reducedMotion ? "w-full" : "hero-progress"}`}
                    style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                  />
                )}
              </button>
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
    </div>
  );
}
