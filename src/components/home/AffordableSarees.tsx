import ViewAllButton from "@/components/ViewAllButton";
import Container from "@/components/Container";

export default function AffordableSarees() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-dark px-6 py-16 text-center text-surface sm:px-12 sm:py-20">
          {/* Decorative gold accent */}
          <div className="mx-auto mb-6 h-0.5 w-16 bg-secondary" />

          <h2 className="font-serif text-2xl font-semibold sm:text-4xl">
            View Our Most Affordable Sarees
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-surface/80 sm:text-lg">
            Get your saree below ₹2500 — handpicked drapes that bring everyday
            elegance without stretching your budget.
          </p>

          <div className="mt-2">
            <ViewAllButton
              href="/collections/under-2500"
              label="Shop Under ₹2500"
              variant="light"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
