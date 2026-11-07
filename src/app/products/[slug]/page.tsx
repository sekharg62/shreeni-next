import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { TagList } from "@/components/ui/Tag";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyBox from "@/components/product/ProductBuyBox";
import ProductStory from "@/components/product/ProductStory";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts, { RelatedProductsSkeleton } from "@/components/product/RelatedProducts";
import ProductReviews, { ProductReviewsSkeleton } from "@/components/product/ProductReviews";
import { env } from "@/config/env";
import { getPrerenderProductSlugs, getProduct } from "@/lib/data/catalog";
import type { ProductDetail } from "@/types/product";

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
  const description = product.shortDescription ?? product.description.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      ...(product.images[0] && { images: [{ url: product.images[0] }] }),
    },
  };
}

function crumbsFor(product: ProductDetail): Crumb[] {
  return [
    { label: "Home", href: "/" },
    ...product.breadcrumb.map((c) => ({ label: c.name, href: c.slug ? `/sarees/${c.slug}` : undefined })),
    { label: product.name },
  ];
}

/** schema.org Product, so search results can show price and availability. */
function productJsonLd(product: ProductDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    image: product.images,
    url: new URL(`/products/${product.slug}`, env.siteUrl).toString(),
    brand: { "@type": "Brand", name: "Shreeni" },
    ...(product.maker.countryOfOrigin && { countryOfOrigin: product.maker.countryOfOrigin }),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price.toFixed(2),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: new URL(`/products/${product.slug}`, env.siteUrl).toString(),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }}
      />

      <Container className="pt-6 sm:pt-8">
        <Breadcrumb items={crumbsFor(product)} />
      </Container>

      {/* Above the fold: everything from one API call */}
      <Container className="mt-6 sm:mt-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div>
              <h1 className="font-serif text-3xl font-semibold leading-tight text-dark sm:text-4xl">{product.name}</h1>
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
            />
          </div>
        </div>
      </Container>

      <Container className="mt-16 space-y-16 pb-20 sm:mt-20 sm:space-y-20">
        <ProductStory story={product.story} />
        <ProductDetails product={product} />

        {/* Third API call: approved reviews, streams in after the product */}
        <Suspense fallback={<ProductReviewsSkeleton />}>
          <ProductReviews slug={product.slug} productName={product.name} />
        </Suspense>

        {/* Related products: streams in after the product */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts slug={product.slug} />
        </Suspense>
      </Container>
    </>
  );
}
