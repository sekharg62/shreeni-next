import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import CategoryBanner from "@/components/category/CategoryBanner";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { getCategory, getCategoryProducts, getPrerenderCategorySlugs } from "@/lib/data/catalog";
import type { CategoryDetail } from "@/types/category";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata, snippet } from "@/lib/seo";
import { PRODUCT_GRID, ProductCardSkeleton } from "@/components/productGridLayout";

/** Sentinel used only when the backend is unreachable at build time. */
const PLACEHOLDER = "__placeholder__";

// Prerender every published sub-category at build; new ones render on first visit.
export async function generateStaticParams() {
  const slugs = await getPrerenderCategorySlugs();
  // Cache Components needs at least one entry to validate the route.
  return (slugs.length ? slugs : [PLACEHOLDER]).map((category) => ({ category }));
}

async function loadCategory(slug: string): Promise<CategoryDetail | null> {
  return slug === PLACEHOLDER ? null : getCategory(slug);
}

export async function generateMetadata({ params }: PageProps<"/sarees/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await loadCategory(slug);
  if (!category) return { title: "Not Found" };
  const image = category.bannerUrl ?? category.posterUrl;
  return pageMetadata({
    title: /saree/i.test(category.name) ? category.name : `${category.name} Sarees`,
    description: snippet(
      category.description ??
        `Shop handwoven ${category.name} sarees online at ${siteConfig.name}. Authentic Bengal weaves, delivered across India.`,
    ),
    path: `/sarees/${category.slug}`,
    images: image ? [image] : undefined,
  });
}

function crumbsFor(category: CategoryDetail): Crumb[] {
  return [
    { label: "Home", href: "/" },
    ...category.ancestors.map((a) => ({ label: a.name, href: a.slug ? `/sarees/${a.slug}` : undefined })),
    { label: category.name },
  ];
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/sarees/[category]">) {
  const { category: slug } = await params;
  const category = await loadCategory(slug);
  if (!category) notFound();
  // The banner artwork already shows the name and description, so with a banner the page doesn't
  // repeat them (they stay in the page, visually hidden, for search engines and screen readers).
  const hasBanner = Boolean(category.bannerUrl ?? category.posterUrl);

  return (
    <>
      <Container className="pt-3 sm:pt-4">
        <Breadcrumb items={crumbsFor(category)} />
      </Container>

      {/* Phones: edge to edge. Tablet/desktop: lined up with the breadcrumb and grid (same gutters as <Container>). */}
      <div className="mt-3 sm:mx-auto sm:mt-4 sm:max-w-[1440px] sm:px-6 lg:px-8">
        <CategoryBanner name={category.name} bannerUrl={category.bannerUrl} posterUrl={category.posterUrl} />
      </div>

      <section className={`pb-20 ${hasBanner ? "pt-2 sm:pt-4" : "pt-8 sm:pt-10"}`}>
        <Container>
          {hasBanner ? (
            <header className="sr-only">
              <h1>{category.name}</h1>
              {category.description && <p>{category.description}</p>}
            </header>
          ) : (
            <header className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">{category.name}</h1>
              <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
              {category.description && (
                <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{category.description}</p>
              )}
            </header>
          )}

          {/* The header above is static; the product grid streams in (it reads ?page=). */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <CategoryProducts
              slug={category.slug}
              name={category.name}
              searchParams={searchParams}
              afterBanner={hasBanner}
            />
          </Suspense>
        </Container>
      </section>
    </>
  );
}

async function CategoryProducts({
  slug,
  name,
  searchParams,
  afterBanner,
}: {
  slug: string;
  /** Directly under the banner (no visible title): less space above the product count. */
  afterBanner: boolean;
  name: string;
  searchParams: PageProps<"/sarees/[category]">["searchParams"];
}) {
  const raw = (await searchParams).page;
  const requested = Number(Array.isArray(raw) ? raw[0] : raw);
  const page = Number.isInteger(requested) && requested >= 1 && requested <= 1000 ? requested : 1;

  const result = await getCategoryProducts(slug, page);
  if (!result) notFound();
  const { items, meta } = result;

  // Asked for a page past the end: send them to the last real page's content.
  if (items.length === 0 && meta.total > 0) {
    return (
      <p className="mt-16 text-center text-muted">
        That page doesn&apos;t exist.{" "}
        <Link href={`/sarees/${slug}`} className="font-medium text-primary underline underline-offset-4">
          Back to page 1
        </Link>
      </p>
    );
  }

  if (meta.total === 0) {
    return (
      <div className="mx-auto mt-14 max-w-md rounded-lg border border-dashed border-border px-6 py-14 text-center">
        <p className="font-serif text-xl font-semibold text-dark">New {name} pieces are on their way</p>
        <p className="mt-2 text-sm text-muted">Our weavers are finishing this collection. Please check back soon.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-surface transition-opacity hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const from = (meta.page - 1) * meta.limit + 1;
  const to = from + items.length - 1;

  return (
    <>
      <p className={`${afterBanner ? "mt-2" : "mt-10"} border-b border-border pb-3 text-sm text-muted`} aria-live="polite">
        {meta.total <= meta.limit
          ? `${meta.total} ${meta.total === 1 ? "product" : "products"}`
          : `Showing ${from}–${to} of ${meta.total} products`}
      </p>
      <ul className={`mt-5 sm:mt-6 ${PRODUCT_GRID}`}>
        {items.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        hrefFor={(p) => (p === 1 ? `/sarees/${slug}` : `/sarees/${slug}?page=${p}`)}
      />
    </>
  );
}

function ProductGridSkeleton() {
  return (
    <div aria-hidden="true" className="mt-10">
      <div className="h-5 w-32 animate-pulse rounded bg-background" />
      <div className={`mt-8 ${PRODUCT_GRID}`}>
        {Array.from({ length: 8 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
