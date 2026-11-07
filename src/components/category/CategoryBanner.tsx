import { getImageProps } from "next/image";

type Props = {
  name: string;
  /** Wide desktop image (≈8:3). */
  bannerUrl: string | null;
  /** Portrait image (≈3:4), used below 640px. */
  posterUrl: string | null;
};

/**
 * Category hero: banner on desktop, poster on phones. Only the matching image downloads.
 * With only one of the two, that one is used everywhere; with neither, nothing renders.
 */
export default function CategoryBanner({ name, bannerUrl, posterUrl }: Props) {
  const desktopSrc = bannerUrl ?? posterUrl;
  const mobileSrc = posterUrl ?? bannerUrl;
  if (!desktopSrc || !mobileSrc) return null;

  // Phone shape follows whichever image phones actually get.
  const mobileShape = posterUrl ? "aspect-[4/5]" : "aspect-[8/3]";
  const desktopShape = bannerUrl ? "sm:aspect-[8/3]" : "sm:aspect-[4/5] sm:max-w-md sm:mx-auto";

  // Full width on phones; inside the 1440px content area (minus gutters) from 640px up.
  const common = { alt: name, fill: true, sizes: "(min-width: 1440px) 1376px, 100vw" } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: desktopSrc });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: mobileSrc });

  return (
    <div className={`relative w-full overflow-hidden bg-background sm:rounded-lg ${mobileShape} ${desktopShape} sm:max-h-[70vh]`}>
      <picture>
        <source media="(min-width: 640px)" srcSet={desktop} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...img} srcSet={mobile} loading="eager" fetchPriority="high" className="object-cover" />
      </picture>
    </div>
  );
}
