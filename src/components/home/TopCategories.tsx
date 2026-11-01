import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";

// ⬇️ Replace the `image` URLs with your own category image URLs.
const categories = [
  { name: "Silk", href: "/sarees/silk", image: "https://picsum.photos/seed/cat-silk/300/300" },
  { name: "Cotton", href: "/sarees/cotton", image: "https://picsum.photos/seed/cat-cotton/300/300" },
  { name: "Designer", href: "/sarees/designer", image: "https://picsum.photos/seed/cat-designer/300/300" },
  { name: "Banarasi", href: "/sarees/banarasi", image: "https://picsum.photos/seed/cat-banarasi/300/300" },
  { name: "Kanjivaram", href: "/sarees/kanjivaram", image: "https://picsum.photos/seed/cat-kanjivaram/300/300" },
  { name: "Wedding", href: "/collections/wedding", image: "https://picsum.photos/seed/cat-wedding/300/300" },
  { name: "Organza", href: "/sarees/organza", image: "https://picsum.photos/seed/cat-organza/300/300" },
  { name: "Linen", href: "/sarees/linen", image: "https://picsum.photos/seed/cat-linen/300/300" },
];

export default function TopCategories() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Categories
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-dark sm:text-3xl lg:text-4xl">
            Our Top Categories
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-full border-2 border-border transition-colors group-hover:border-secondary">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-sm font-medium text-dark transition-colors group-hover:text-primary">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
