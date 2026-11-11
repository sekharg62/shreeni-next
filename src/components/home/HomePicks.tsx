import { cacheLife, cacheTag } from "next/cache";
import Container from "@/components/Container";
import HandpickedCard from "@/components/home/HandpickedCard";
import ViewAllButton from "@/components/ViewAllButton";
import { CACHE_TAGS, HOME_PICKS_LIMIT } from "@/config/constants";
import { homePickService } from "@/services/homePickService";
import type { ProductCardItem } from "@/types/product";

async function getHomePicks(): Promise<ProductCardItem[]> {
  "use cache";
  // Picks change in the admin; prices and stock change with the products.
  cacheTag(CACHE_TAGS.homePicks, CACHE_TAGS.products);
  try {
    const picks = await homePickService.list(HOME_PICKS_LIMIT);
    cacheLife("minutes"); // admin edits (and scheduled start/end dates) show within about a minute
    return picks;
  } catch (err) {
    // Backend down: hide the section, retry soon.
    console.error("[HomePicks] could not load picks:", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return [];
  }
}

/**
 * "Handpicked for You": products chosen in the admin (Marketing › Homepage picks), on a dark
 * showcase band. Phones: one swipeable row (the next card peeks in). From 768px: a 4-column grid.
 * Hidden when nothing is live. Rename to "Bestsellers" only once it's filled from real sales.
 */
export default async function HomePicks() {
  const picks = await getHomePicks();
  if (picks.length === 0) return null;

  return (
    <section
      aria-label="Handpicked for You"
      className="relative overflow-hidden bg-dark py-20 text-surface sm:py-24"
    >
      {/* A faint gold glow from the top, like light falling into a display case. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(184,134,70,0.18),transparent_70%)]"
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Curated</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Handpicked for You</h2>
          <span aria-hidden="true" className="mx-auto mt-4 flex w-fit items-center gap-2 text-secondary">
            <span className="h-px w-10 bg-current" />
            <span className="h-2 w-2 rotate-45 border border-current" />
            <span className="h-px w-10 bg-current" />
          </span>
          <p className="mt-5 text-surface/70 sm:text-lg">
            Sarees our team loves right now, chosen from the looms of Bengal.
          </p>
        </div>

        <ul
          className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 pt-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 sm:mt-14 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-8"
        >
          {picks.map((p) => (
            <li key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[42%] md:w-auto">
              <HandpickedCard product={p} />
            </li>
          ))}
        </ul>

        {picks.length > 1 && (
          <p aria-hidden="true" className="mt-4 text-center text-[11px] uppercase tracking-[0.25em] text-surface/40 md:hidden">
            Swipe to see more
          </p>
        )}

        <ViewAllButton href="/sarees" label="Shop all sarees" variant="light" />
      </Container>
    </section>
  );
}
