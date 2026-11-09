import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { TagList } from "@/components/ui/Tag";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyBox from "@/components/product/ProductBuyBox";
import ShareButton from "@/components/product/ShareButton";
import DeliveryCheck from "@/components/product/DeliveryCheck";
import { ProductHighlights, TrustLine } from "@/components/product/ProductHighlights";
import { Stars } from "@/components/ui/StarRating";
import ProductStory from "@/components/product/ProductStory";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts, { RelatedProductsSkeleton } from "@/components/product/RelatedProducts";
import ProductReviews, { ProductReviewsSkeleton } from "@/components/product/ProductReviews";
import { siteConfig } from "@/config/siteConfig";
import { getPrerenderProductSlugs, getProduct, getProductReviews } from "@/lib/data/catalog";
import { absoluteUrl, pageMetadata, snippet } from "@/lib/seo";
import type { ProductDetail } from "@/types/product";
import type { ReviewSummary } from "@/types/review";

/** Sentinel used only when the backend is unreachable at build time. */
const PLACEHOLDER = "__placeholder__";

// Prerender products shown on category pages; any other product renders on first visit.
export async function generateStaticParams() {
  const slugs = await getPrerenderProductSlugs();
  return (slugs.length ? slugs : [PLACEHOLDER]).map((slug) => ({ slug }));
}

async function loadProduct(slug: string): Promise<ProductDetail | null> {
  return slug === PLACEHOLDER ? null : getProduct(slug);
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Not Found" };
  return pageMetadata({
    title: product.name,
    description: snippet(product.shortDescription ?? product.description),
    path: `/products/${product.slug}`,
    images: product.images.slice(0, 4),
  });
}

function crumbsFor(product: ProductDetail): Crumb[] {
  return [
    { label: "Home", href: "/" },
    ...product.breadcrumb.map((c) => ({ label: c.name, href: c.slug ? `/sarees/${c.slug}` : undefined })),
    { label: product.name },
  ];
}

/** schema.org Product, so search results can show price, availability and star rating. */
function productJsonLd(product: ProductDetail, reviews: ReviewSummary | null) {
  const url = absoluteUrl(`/products/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    image: product.images,
    url,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.maker.countryOfOrigin && { countryOfOrigin: product.maker.countryOfOrigin }),
    ...(reviews &&
      reviews.count > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: reviews.average,
          reviewCount: reviews.count,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price.toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();
  // Cached (shared with the reviews section); null when reviews can't be loaded.
  const reviews = await getProductReviews(product.slug);
  const rating = reviews?.summary ?? null;
  const category = product.breadcrumb.at(-1) ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, reviews?.summary ?? null)).replace(/</g, "\\u003c") }}
      />

      <Container className="pt-4 sm:pt-6">
        <Breadcrumb items={crumbsFor(product)} />
      </Container>

      {/* Above the fold: everything from one API call. Desktop: lookbook photos beside a sticky panel. */}
      <Container className="mt-4 sm:mt-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <ProductGallery images={product.images} name={product.name} soldOut={!product.inStock} />

          <div className="fade-up flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start lg:pb-8">
            <header>
              {category &&
                (category.slug ? (
                  <Link
                    href={`/sarees/${category.slug}`}
                    className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ) : (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">{category.name}</p>
                ))}
              <div className="mt-2 flex items-start justify-between gap-4">
                <h1 className="font-serif text-3xl font-semibold leading-tight text-dark sm:text-4xl">{product.name}</h1>
                <ShareButton path={`/products/${product.slug}`} title={product.name} className="mt-0.5" />
              </div>
              <a
                href="#reviews"
                className="mt-3 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
              >
                {rating && rating.count > 0 ? (
                  <>
                    <Stars value={rating.average} label={`Rated ${rating.average} out of 5`} />
                    <span>
                      <span className="font-semibold text-dark">{rating.average.toFixed(1)}</span> · {rating.count} review
                      {rating.count === 1 ? "" : "s"}
                    </span>
                  </>
                ) : (
                  <span className="underline underline-offset-4">Be the first to review</span>
                )}
              </a>
              {product.shortDescription && (
                <p className="mt-4 leading-relaxed text-dark/75">{product.shortDescription}</p>
              )}
            </header>

            <TagList tags={product.tags} />

            <ProductBuyBox
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.images[0] ?? null}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              variants={product.variants}
              category={category?.name}
              highlights={<ProductHighlights product={product} />}
            />

            <DeliveryCheck />
            <TrustLine />
          </div>
        </div>
      </Container>

      <Container className="mt-20 space-y-20 pb-24 sm:mt-28 sm:space-y-28">
        <ProductStory story={product.story} image={product.images[1] ?? product.images[0] ?? null} name={product.name} />
        <ProductDetails product={product} />

        {/* Related products ("You may also like"): streams in after the product */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts slug={product.slug} />
        </Suspense>

        {/* Approved reviews: streams in after the product */}
        <Suspense fallback={<ProductReviewsSkeleton />}>
          <ProductReviews slug={product.slug} productName={product.name} />
        </Suspense>
      </Container>
    </>
  );
}
