import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import { CategoryTile, getTopCategories } from "@/components/home/TopCategories";
import Pagination from "@/components/ui/Pagination";
import { CATEGORY_SLUGS } from "@/config/constants";
import { siteConfig } from "@/config/siteConfig";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import type { CategoryCard } from "@/types/category";

export const metadata: Metadata = pageMetadata({
  title: "All Sarees — Shop by Weave",
  description:
    "Shop handwoven Bengal sarees by weave: Baluchori, Swarnachori, Jamdani, Tant, Kantha Stitch, Murshidabad and Bishnupuri silk, and handloom cottons.",
  path: "/sarees",
});

/** Weaves per page on /sarees (two rows of five on desktop). */
const WEAVES_PER_PAGE = 10;

/** `?page=` as a whole number ≥ 1; anything else is page 1. */
function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

const pageHref = (p: number) => (p === 1 ? "/sarees" : `/sarees?page=${p}`);

/** schema.org list of the weave pages, so search engines see the shop's structure. */
function collectionJsonLd(categories: CategoryCard[], offset: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Sarees",
    url: absoluteUrl("/sarees"),
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: absoluteUrl("/") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((c, i) => ({
        "@type": "ListItem",
        position: offset + i + 1,
        name: `${c.name} Sarees`,
        url: absoluteUrl(`/sarees/${c.slug}`),
      })),
    },
  };
}

async function Weaves({ searchParams }: { searchParams: PageProps<"/sarees">["searchParams"] }) {
  const page = parsePage((await searchParams).page);
  const { data: categories, meta } = await getTopCategories(
    CATEGORY_SLUGS.homeTopCategoriesParent,
    page,
    WEAVES_PER_PAGE,
  );

  if (meta.total === 0) {
    return <p className="mt-12 text-center text-muted">Our collections are being updated. Please check back soon.</p>;
  }
  if (categories.length === 0) {
    // Asked for a page past the end.
    return (
      <p className="mt-16 text-center text-muted">
        That page doesn&apos;t exist.{" "}
        <Link href="/sarees" className="font-medium text-primary underline underline-offset-4">
          Back to page 1
        </Link>
      </p>
    );
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd(categories, (meta.page - 1) * meta.limit)).replace(/</g, "\\u003c"),
        }}
      />
      <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
        {categories.map((c) => (
          <li key={c.slug}>
            <CategoryTile category={c} />
          </li>
        ))}
      </ul>
      <Pagination page={meta.page} totalPages={meta.totalPages} hrefFor={pageHref} />
    </>
  );
}

function WeavesSkeleton() {
  return (
    <div aria-hidden="true" className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
      {Array.from({ length: WEAVES_PER_PAGE }, (_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-border/50" />
      ))}
    </div>
  );
}

/** /sarees — every weave in one place (the main menu's "Sarees" link). */
export default function SareesPage({ searchParams }: PageProps<"/sarees">) {
  return (
    <section className="pb-20 pt-3 sm:pt-4">
      <Container>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Sarees" }]} />
        <header className="mx-auto mt-8 max-w-3xl text-center sm:mt-10">
          <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">Shop Sarees by Weave</h1>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
          <p className="mt-5 leading-relaxed text-muted sm:text-lg">
            Every saree at {siteConfig.name} is handpicked from weavers across Bengal. Choose a weave to explore — from the
            storytelling pallus of Baluchori to airy Jamdani and everyday Tant cottons.
          </p>
        </header>
        <Suspense fallback={<WeavesSkeleton />}>
          <Weaves searchParams={searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}
