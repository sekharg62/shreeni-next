import { Suspense } from "react";
import HeroBanners from "@/components/home/HeroBanners";
import TopCategories from "@/components/home/TopCategories";
import AffordableSarees from "@/components/home/AffordableSarees";
import Testimonials from "@/components/home/Testimonials";

/*
 * API-driven sections sit in <Suspense>. Normally their data is cached and part of
 * the prebuilt page; if the backend is down they stream in later instead of
 * breaking the build. Fallbacks match the final size so nothing jumps.
 */

function HeroFallback() {
  return <div aria-hidden="true" className="aspect-[4/5] w-full animate-pulse bg-dark/10 sm:aspect-[8/3] sm:max-h-[80vh]" />;
}

function TopCategoriesFallback() {
  return (
    <div aria-hidden="true" className="bg-surface py-20 sm:py-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-4 gap-y-10 px-4 sm:grid-cols-4 sm:gap-x-6 sm:px-6 lg:px-8">
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
      <Suspense fallback={<HeroFallback />}>
        <HeroBanners />
      </Suspense>
      <Suspense fallback={<TopCategoriesFallback />}>
        <TopCategories />
      </Suspense>
      <AffordableSarees />
      <Testimonials />
    </>
  );
}
