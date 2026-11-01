import type { Metadata } from "next";
import FaqSection from "@/components/home/FaqSection";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Shreeni sarees — authenticity, delivery, returns, shipping, and care.",
};

export default function FaqPage() {
  return <FaqSection />;
}
