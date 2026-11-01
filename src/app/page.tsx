import HeroCarousel from "@/components/home/HeroCarousel";
import TopCategories from "@/components/home/TopCategories";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import AffordableSarees from "@/components/home/AffordableSarees";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <TopCategories />
      <NewArrivals />
      <BestSellers />
      <AffordableSarees />
      <Testimonials />
    </>
  );
}
