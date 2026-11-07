import type { Metadata } from "next";
import FaqSection from "@/components/home/FaqSection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about Shreeni sarees — authenticity, delivery, returns, shipping, and care.",
  path: "/faqs",
});

export default function FaqPage() {
  return <FaqSection />;
}
