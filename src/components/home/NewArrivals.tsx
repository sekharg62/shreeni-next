import Link from "next/link";
import Image from "next/image";
import ViewAllButton from "@/components/ViewAllButton";

// ⬇️ Replace the `image` URLs with your own product image URLs.
const products = [
  {
    name: "Kanjivaram Silk",
    price: "₹8,499",
    href: "/sarees/silk",
    image: "https://picsum.photos/seed/arrival-1/600/800",
  },
  {
    name: "Banarasi Weave",
    price: "₹6,999",
    href: "/sarees/silk",
    image: "https://picsum.photos/seed/arrival-2/600/800",
  },
  {
    name: "Organza Floral",
    price: "₹4,299",
    href: "/sarees/designer",
    image: "https://picsum.photos/seed/arrival-3/600/800",
  },
  {
    name: "Handloom Cotton",
    price: "₹2,799",
    href: "/sarees/cotton",
    image: "https://picsum.photos/seed/arrival-4/600/800",
  },
];

export default function NewArrivals() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            New Arrival
          </p>
          <h2 className="mt-3 whitespace-nowrap font-serif text-base font-semibold text-dark sm:text-xl md:text-2xl lg:text-3xl">
            Fresh Season | New Designs | Latest Trends
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-surface"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg font-semibold text-dark">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-secondary">
                  {p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <ViewAllButton href="/collections/new-arrivals" />
      </div>
    </section>
  );
}
