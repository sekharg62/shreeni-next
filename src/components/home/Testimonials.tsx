import SectionHeader from "@/components/SectionHeader";
import Container from "@/components/Container";

const testimonials = [
  {
    quote:
      "The silk saree I ordered was even more beautiful in person. The weave and colours are stunning — I've received so many compliments!",
    name: "Ananya Sharma",
    location: "Mumbai",
  },
  {
    quote:
      "Fast delivery and gorgeous packaging. You can tell these are authentic handloom pieces. Shreeni is now my go-to for festive shopping.",
    name: "Priya Nair",
    location: "Bengaluru",
  },
  {
    quote:
      "Loved how easy the whole experience was, from browsing to checkout. The return policy gave me total peace of mind.",
    name: "Ritika Verma",
    location: "Delhi",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-secondary" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 17l-4.9 2.6.9-5.5-4-3.9 5.5-.8z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Loved by Customers"
          title="What our customers say"
          subtitle="Real words from women who found their perfect saree with us."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-md border border-border bg-surface p-6"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-muted">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-semibold text-dark">{t.name}</p>
                <p className="text-sm text-muted">{t.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
