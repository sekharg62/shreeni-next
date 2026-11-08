import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { TagList } from "@/components/ui/Tag";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyBox from "@/components/product/ProductBuyBox";
import ShareButton from "@/components/product/ShareButton";
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, reviews?.summary ?? null)).replace(/</g, "\\u003c") }}
      />

      <Container className="pt-6 sm:pt-8">
        <Breadcrumb items={crumbsFor(product)} />
      </Container>

      {/* Above the fold: everything from one API call */}
      <Container className="mt-6 sm:mt-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} soldOut={!product.inStock} />

          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-3xl font-semibold leading-tight text-dark sm:text-4xl">{product.name}</h1>
                <ShareButton path={`/products/${product.slug}`} title={product.name} className="mt-0.5" />
              </div>
              {product.shortDescription && <p className="mt-3 leading-relaxed text-muted">{product.shortDescription}</p>}
            </div>
            <TagList tags={product.tags} />
            <ProductBuyBox
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.images[0] ?? null}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              variants={product.variants}
              category={product.breadcrumb.at(-1)?.name}
            />
          </div>
        </div>
      </Container>

      <Container className="mt-16 space-y-16 pb-20 sm:mt-20 sm:space-y-20">
        <ProductStory story={product.story} />
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
