import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

type ProductGridProps = {
  title: string;
  description?: string;
  products: Product[];
};

export default function ProductGrid({
  title,
  description,
  products,
}: ProductGridProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <header className="border-b border-border pb-8">
          <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">
            {title}
          </h1>
          {description && <p className="mt-3 text-muted">{description}</p>}
          <p className="mt-2 text-sm text-muted">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </header>

        {products.length === 0 ? (
          <p className="py-20 text-center text-muted">
            No products found in this collection yet.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
