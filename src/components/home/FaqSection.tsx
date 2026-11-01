import SectionHeader from "@/components/SectionHeader";
import FaqAccordion from "@/components/home/FaqAccordion";

const faqs = [
  {
    question: "Are your sarees authentic handloom?",
    answer:
      "Yes. Every saree is sourced directly from master weavers and verified for authenticity, so you receive genuine handloom craftsmanship.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are typically dispatched within 1–2 business days and delivered across India within 3–7 business days, depending on your location. You'll receive live tracking updates.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "We offer a hassle-free 7-day return and exchange on all eligible items, provided they are unused and in their original condition with tags intact.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes, we offer free shipping on all orders above ₹1999. A nominal shipping fee applies to orders below this amount.",
  },
  {
    question: "How should I care for my saree?",
    answer:
      "We recommend dry cleaning for silk sarees and gentle hand washing for cotton. Detailed care instructions are included with every order.",
  },
];

// FAQ structured data — helps Google rich results and AI answer engines.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqSection() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know before you shop with us."
        />

        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}
