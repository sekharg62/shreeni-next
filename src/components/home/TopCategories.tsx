import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import Container from "@/components/Container";
import { CACHE_TAGS, CATEGORY_SLUGS } from "@/config/constants";
import { categoryService } from "@/services/categoryService";
import type { Paginated } from "@/types/api";
import type { CategoryCard } from "@/types/category";
import { formatINR, paiseToRupees } from "@/lib/format";

/** One page of a category's children for the card grids. On failure: an empty page (the section hides). */
export async function getTopCategories(
  slug: string,
  page = 1,
  limit = 10,
): Promise<Paginated<CategoryCard>> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  try {
    const result = await categoryService.children({ slug, page, limit });
    cacheLife("minutes"); // admin edits show up within about a minute
    return result;
  } catch (err) {
    // Backend down or parent slug missing: hide the section, retry soon.
    console.error(
      "[TopCategories] could not load categories:",
      err instanceof Error ? err.message : err,
    );
    cacheLife("seconds");
    return { data: [], meta: { page, limit, total: 0, totalPages: 1 } };
  }
}

/** Small gold rule with a diamond in the middle. */
function GoldDivider() {
  return (
    <span
      aria-hidden="true"
      className="flex items-center gap-1.5 text-secondary"
    >
      <span className="h-px w-6 bg-current sm:w-8" />
      <span className="h-1.5 w-1.5 rotate-45 border border-current" />
      <span className="h-px w-6 bg-current sm:w-8" />
    </span>
  );
}

/**
 * Full-width burgundy ribbon along the bottom edge of the card: gold rule on top,
 * gold-foil percentage between two small diamonds, and a soft sheen on hover.
 * Sits at the bottom so the top of the poster stays clear.
 */
function DiscountRibbon({
  percent,
  featured,
}: {
  percent: number;
  featured: boolean;
}) {
  return (
    <span
      className={`relative z-10 flex w-full items-center justify-center overflow-hidden border-t border-secondary/80 bg-gradient-to-r from-dark via-primary to-dark shadow-[0_-6px_16px_rgba(0,0,0,0.35)] ${
        featured
          ? "gap-2.5 py-2.5 sm:gap-3 sm:py-3"
          : "gap-1.5 py-1.5 sm:gap-2 sm:py-2"
      }`}
    >
      {/* Thin second gold line just under the top rule. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[3px] h-px bg-secondary/30"
      />

      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rotate-45 bg-secondary/80"
      />
      <span
        className={`font-medium uppercase leading-none tracking-[0.22em] text-secondary/90 ${
          featured ? "text-[10px] sm:text-xs" : "text-[8px] sm:text-[10px]"
        }`}
      >
        Up to
      </span>
      <span
        className={`bg-gradient-to-b from-[#f6e2b3] via-secondary to-[#8a6230] bg-clip-text font-serif font-semibold leading-none text-transparent ${
          featured ? "text-2xl sm:text-3xl" : "text-base sm:text-xl"
        }`}
      >
        {percent}%
      </span>
      <span
        className={`font-semibold uppercase leading-none tracking-[0.22em] text-surface ${
          featured ? "text-[10px] sm:text-xs" : "text-[8px] sm:text-[10px]"
        }`}
      >
        Off
      </span>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rotate-45 bg-secondary/80"
      />

      {/* Foil sheen on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-[left] duration-1000 ease-out group-hover:left-[130%] motion-reduce:hidden"
      />
    </span>
  );
}

/** Homepage card count: exactly fills the mosaic (one large card + four beside it). */
const HOME_CATEGORY_LIMIT = 5;

const SMALL_SIZES = "(max-width: 640px) 50vw, (max-width: 1440px) 25vw, 340px";
const FEATURED_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1440px) 50vw, 700px";

/**
 * Editorial category card: poster with a gold inner frame, name and tagline on a dark fade,
 * piece count and starting price. `featured` is the large mosaic card on the homepage.
 */
/**
 * Homepage mosaic (phones and desktop): a bigger radius on one outer corner of the whole block
 * (top-left of the big card, bottom-right of the last small card). Everything else keeps rounded-lg.
 * The gold inner frame follows with a radius smaller by its inset, so the two curves stay parallel.
 */
const ACCENT_CORNER = {
  // Frame inset is 8px on phones, 12px from 640px: 40px - inset.
  tl: { card: "rounded-tl-[2.5rem]", frame: "rounded-tl-[2rem] sm:rounded-tl-[1.75rem]" },
  br: { card: "rounded-br-[2.5rem]", frame: "rounded-br-[2rem] sm:rounded-br-[1.75rem]" },
} as const;

export function CategoryTile({
  category,
  featured = false,
  accentCorner,
}: {
  category: CategoryCard;
  featured?: boolean;
  accentCorner?: keyof typeof ACCENT_CORNER;
}) {
  const accent = accentCorner ? ACCENT_CORNER[accentCorner] : null;
  const { name, slug, posterUrl, tagline, minPrice, maxDiscountPercent } =
    category;
  // No price means nothing is on sale in this category yet.
  const hasDiscount = maxDiscountPercent >= 5;
  const meta =
    minPrice !== null
      ? `From ${formatINR(paiseToRupees(minPrice))}`
      : "New pieces coming soon";

  return (
    <Link
      href={`/sarees/${slug}`}
      className={`group relative block h-full w-full overflow-hidden rounded-lg ${accent?.card ?? ""} bg-dark shadow-sm ring-offset-2 ring-offset-surface transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        featured ? "aspect-[4/5] sm:aspect-auto sm:min-h-full" : "aspect-[3/4]"
      }`}
    >
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt=""
          fill
          sizes={featured ? FEATURED_SIZES : SMALL_SIZES}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
      ) : (
        // No poster uploaded yet: a branded tile instead of a broken image.
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-start justify-center bg-gradient-to-br from-primary via-primary/95 to-dark pt-[18%]"
        >
          <span
            className={`font-serif font-semibold text-secondary/40 ${featured ? "text-[9rem] sm:text-[12rem]" : "text-7xl sm:text-8xl"}`}
          >
            {name.charAt(0)}
          </span>
        </div>
      )}

      {/* Dark fade so the text always reads, whatever the photo. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent ${featured ? "via-dark/40 via-35%" : "via-dark/30 via-45%"}`}
      />
      {/* Gold inner frame */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-2 rounded-md ${accent?.frame ?? ""} border border-secondary/45 transition-colors duration-300 group-hover:border-secondary sm:inset-3`}
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col">
        <div
          className={`flex flex-col items-center px-4 text-center text-surface ${
            hasDiscount
              ? featured
                ? "pb-5 sm:pb-7"
                : "pb-3 sm:pb-4"
              : featured
                ? "pb-8 sm:pb-12"
                : "pb-5 sm:pb-7"
          }`}
        >
          {featured && (
            <span className="mb-3 rounded-full bg-dark/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-secondary backdrop-blur-sm sm:text-xs">
              Signature weave
            </span>
          )}
          <span
            className={`font-serif font-semibold leading-tight ${featured ? "text-3xl sm:text-5xl" : "text-lg sm:text-2xl"}`}
          >
            {name}
          </span>
          {tagline && (
            <span
              className={`mt-1 font-serif italic text-surface/85 ${featured ? "line-clamp-1 text-base sm:text-xl" : "line-clamp-2 text-xs sm:line-clamp-1 sm:text-sm"}`}
            >
              {tagline}
            </span>
          )}
          <span className={featured ? "my-3 sm:my-4" : "my-2 sm:my-3"}>
            <GoldDivider />
          </span>
          <span
            className={`tracking-wide text-surface/90 ${featured ? "text-sm" : "text-[11px] sm:text-xs"}`}
          >
            {meta}
          </span>
          {/* Desktop: slides in on hover. Phones: always shown. */}
          <span
            aria-hidden="true"
            className={`mt-2 inline-flex items-center gap-1 font-semibold uppercase tracking-[0.18em] text-secondary transition duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100 motion-reduce:transition-none ${
              featured ? "text-xs" : "text-[10px] sm:text-[11px]"
            }`}
          >
            Explore{" "}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        {hasDiscount && (
          <DiscountRibbon percent={maxDiscountPercent} featured={featured} />
        )}
      </div>
    </Link>
  );
}

/** Cards after the mosaic: wrap and centre, so a short last row looks intentional. */
function CategoryRow({ categories }: { categories: CategoryCard[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {categories.map((c) => (
        <li
          key={c.slug}
          className="w-[calc(50%-0.5rem)] sm:w-[calc(25%-1.125rem)]"
        >
          <CategoryTile category={c} />
        </li>
      ))}
    </ul>
  );
}

/** Homepage: the first category large (2×2) with four beside it, the rest in centred rows. */
function CategoryMosaic({ categories }: { categories: CategoryCard[] }) {
  // Too few for a mosaic: one centred row.
  if (categories.length < 5) return <CategoryRow categories={categories} />;
  const [first, ...rest] = categories;
  const beside = rest.slice(0, 4);
  const more = rest.slice(4);
  return (
    <div className="space-y-4 sm:space-y-6">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        <li className="col-span-2 sm:row-span-2">
          <CategoryTile category={first} featured accentCorner="tl" />
        </li>
        {beside.map((c, i) => (
          <li key={c.slug}>
            {/* The 5th card is the block's bottom-right corner on every screen size. */}
            <CategoryTile category={c} accentCorner={i === 3 ? "br" : undefined} />
          </li>
        ))}
      </ul>
      {more.length > 0 && <CategoryRow categories={more} />}
    </div>
  );
}

export default async function TopCategories() {
  // Ask the API for just the mosaic's five cards; the total tells the button how many there are.
  const { data: shown, meta } = await getTopCategories(
    CATEGORY_SLUGS.homeTopCategoriesParent,
    1,
    HOME_CATEGORY_LIMIT,
  );
  if (shown.length === 0) return null;
  const hasMore = meta.total > shown.length;

  return (
    <section
      id="categories"
      className="scroll-mt-24 bg-surface py-20 sm:py-24"
      aria-labelledby="top-categories-heading"
    >
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Categories
          </p>
          <h2
            id="top-categories-heading"
            className="mt-3 font-serif text-2xl font-semibold text-dark sm:text-3xl lg:text-4xl"
          >
            Our Top Categories
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
            Handwoven in Bengal, from everyday Tant to heirloom Baluchori silk.
          </p>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
        </div>

        <div className="mt-12 sm:mt-14">
          <CategoryMosaic categories={shown} />
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/sarees"
            className="group inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {hasMore ? `View all ${meta.total} weaves` : "Shop all weaves"}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
