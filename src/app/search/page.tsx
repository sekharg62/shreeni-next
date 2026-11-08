import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { Search } from "lucide-react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/ui/Pagination";
import CatalogSkeleton from "@/components/filters/CatalogSkeleton";
import SearchSortSelect from "@/components/search/SearchSortSelect";
import { PRODUCT_GRID } from "@/components/productGridLayout";
import { navLinks } from "@/config/nav";
import { getSearchResults } from "@/lib/data/catalog";
import type { SearchSort } from "@/types/product";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Shreeni's handwoven Bengal sarees by weave, colour or fabric.",
  // Result pages are endless near-duplicates: keep them out of search engines.
  robots: { index: false, follow: true },
};

const SORTS = new Set<SearchSort>(["relevance", "newest", "price-asc", "price-desc", "discount"]);
const POPULAR = navLinks.find((l) => l.label === "Sarees")?.items ?? [];
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function SearchBox({ q }: { q: string }) {
  return (
    <Form action="/search" role="search" className="relative mx-auto w-full max-w-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        name="q"
        defaultValue={q}
        aria-label="Search sarees"
        placeholder="Search sarees, weaves, colours…"
        maxLength={100}
        enterKeyHint="search"
        className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-28 text-base text-dark placeholder:text-muted/70 focus:border-primary focus:outline-none"
      />
      <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-dark">
        Search
      </button>
    </Form>
  );
}

function Popular({ title }: { title: string }) {
  return (
    <div className="mt-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {POPULAR.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="inline-flex rounded-full border border-border px-4 py-2 text-sm text-dark transition-colors hover:border-primary hover:text-primary">
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = (first(params.q) ?? "").trim().slice(0, 100);
  const rawSort = first(params.sort) as SearchSort | undefined;
  const sort: SearchSort = rawSort && SORTS.has(rawSort) ? rawSort : "relevance";
  const pageNum = Number(first(params.page));
  const page = Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= 1000 ? pageNum : 1;

  if (!q) {
    return (
      <>
        <SearchBox q="" />
        <Popular title="Popular weaves" />
      </>
    );
  }

  const result = await getSearchResults(q, page, sort);
  const hrefFor = (p: number) => {
    const sp = new URLSearchParams({ q });
    if (sort !== "relevance") sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    return `/search?${sp}`;
  };

  return (
    <>
      <SearchBox q={q} />
      {!result ? (
        <p className="mt-12 text-center text-muted">Search isn&apos;t available right now. Please try again in a moment.</p>
      ) : result.meta.total === 0 ? (
        <div className="mx-auto mt-12 max-w-md text-center">
          <p className="font-serif text-2xl font-semibold text-dark">No results for &ldquo;{q}&rdquo;</p>
          <p className="mt-2 text-sm text-muted">Check the spelling, or try a weave, colour or fabric — like &ldquo;jamdani&rdquo;, &ldquo;red&rdquo; or &ldquo;silk&rdquo;.</p>
          <Popular title="Or browse a weave" />
        </div>
      ) : (
        <>
          <div className="mt-10 flex items-center justify-between gap-4 border-b border-border pb-3">
            <p className="text-sm text-muted" aria-live="polite">
              <span className="font-semibold text-dark">{result.meta.total}</span> {result.meta.total === 1 ? "result" : "results"} for{" "}
              <span className="font-semibold text-dark">&ldquo;{q}&rdquo;</span>
            </p>
            <SearchSortSelect q={q} sort={sort} />
          </div>
          {result.items.length === 0 ? (
            <p className="mt-12 text-center text-muted">
              That page doesn&apos;t exist.{" "}
              <Link href={hrefFor(1)} className="font-medium text-primary underline underline-offset-4">
                Back to page 1
              </Link>
            </p>
          ) : (
            <>
              <ul className={`mt-5 sm:mt-6 ${PRODUCT_GRID}`}>
                {result.items.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
              <Pagination page={result.meta.page} totalPages={result.meta.totalPages} hrefFor={hrefFor} />
            </>
          )}
        </>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section className="pb-20 pt-8 sm:pt-12">
      <Container>
        <h1 className="sr-only">Search</h1>
        <Suspense fallback={<CatalogSkeleton className="mt-24" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}
