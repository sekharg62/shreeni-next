import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

const categories = [
  {
    name: "Silk Sarees",
    tagline: "Regal & timeless",
    href: "/sarees/silk",
    accent: "from-primary/90 to-primary",
  },
  {
    name: "Cotton Sarees",
    tagline: "Everyday elegance",
    href: "/sarees/cotton",
    accent: "from-secondary/90 to-secondary",
  },
  {
    name: "Designer Sarees",
    tagline: "Statement drapes",
    href: "/sarees/designer",
    accent: "from-dark/90 to-dark",
  },
  {
    name: "Wedding Edit",
    tagline: "For the big day",
    href: "/collections/wedding",
    accent: "from-primary/80 to-dark",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Shop by Category"
          title="Find your perfect drape"
          subtitle="From heirloom silks to breezy cottons, explore collections for every occasion."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-md border border-border"
            >
              {/* Placeholder visual (gradient stands in for a product image) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.accent} transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-dark/10" />
              <div className="relative p-5 text-surface">
                <p className="text-xs uppercase tracking-wider text-surface/80">
                  {cat.tagline}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold">
                  {cat.name}
                </h3>
                <span className="mt-2 inline-block text-sm font-medium underline-offset-4 group-hover:underline">
                  Shop now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
