import HeroCarousel from "@/components/home/HeroCarousel";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import AffordableSarees from "@/components/home/AffordableSarees";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <NewArrivals />
      <BestSellers />
      <AffordableSarees />
      <Testimonials />
      <FaqSection />
    </>
  );
}
