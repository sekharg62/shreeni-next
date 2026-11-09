import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/config/siteConfig";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import HeroBanners from "@/components/home/HeroBanners";
import TopCategories from "@/components/home/TopCategories";
import AffordableSarees from "@/components/home/AffordableSarees";
import Testimonials from "@/components/home/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";

/*
 * API-driven sections sit in <Suspense>. Normally their data is cached and part of
 * the prebuilt page; if the backend is down they stream in later instead of
 * breaking the build. Fallbacks match the final size so nothing jumps.
 */

export const metadata: Metadata = pageMetadata({ description: siteConfig.description, path: "/" });

const { contact, location } = siteConfig;

/** Who we are, for Google's brand panel / sitelinks. (Add real social profiles as `sameAs` once they exist.) */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/logo-mark.png"),
      description: siteConfig.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${location.addressLine1}, ${location.addressLine2}`,
        addressLocality: location.city,
        addressRegion: location.state,
        postalCode: location.postalCode,
        addressCountry: location.countryCode,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Bengali", "Hindi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: siteConfig.name,
      url: absoluteUrl("/"),
      inLanguage: "en-IN",
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ],
};

function HeroFallback() {
  return <div aria-hidden="true" className="aspect-[4/5] w-full animate-pulse bg-dark/10 sm:aspect-[8/3] sm:max-h-[80vh]" />;
}

function TopCategoriesFallback() {
  return (
    <div aria-hidden="true" className="bg-surface py-20 sm:py-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6 lg:px-8">
        <div className="col-span-2 aspect-[4/5] animate-pulse rounded-lg bg-background sm:row-span-2 sm:aspect-auto" />
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-background" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c") }}
      />
      <Suspense fallback={<HeroFallback />}>
        <HeroBanners />
      </Suspense>
      <Suspense fallback={<TopCategoriesFallback />}>
        <TopCategories />
      </Suspense>
      <AffordableSarees />
      <Testimonials />
      {/* Floating helpers: homepage only. */}
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}
