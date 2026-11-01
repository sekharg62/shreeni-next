import SectionHeader from "@/components/SectionHeader";

const features = [
  {
    title: "Authentic Handloom Weaves",
    description:
      "Every saree is sourced directly from master weavers, guaranteeing genuine craftsmanship and heritage.",
    icon: (
      <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9 2.6.9-5.5-4-3.9 5.5-.8z" />
    ),
  },
  {
    title: "Pan-India Fast Delivery",
    description:
      "Carefully packaged and shipped across India with reliable courier partners and live tracking.",
    icon: (
      <>
        <rect x="1" y="7" width="15" height="10" rx="1" />
        <path d="M16 10h4l3 3v4h-7z" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
  },
  {
    title: "Easy Returns & Exchange",
    description:
      "Changed your mind? Enjoy a hassle-free 7-day return and exchange on all eligible orders.",
    icon: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 3v4h4" />
      </>
    ),
  },
  {
    title: "Secure Payments",
    description:
      "Shop with confidence using trusted, encrypted payment options and complete data privacy.",
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
];

export default function WhyUs() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why Shreeni"
          title="Crafted with care, delivered with trust"
          subtitle="Thousands of women choose Shreeni for sarees that blend timeless tradition with a seamless shopping experience."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-md border border-border bg-surface p-6 transition-shadow hover:shadow-lg hover:shadow-dark/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  {feature.icon}
                </svg>
              </span>
              <h3 className="mt-5 font-serif text-xl font-semibold text-dark">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
