import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <WhyUs />
      <Testimonials />
      <FaqSection />
    </>
  );
}
