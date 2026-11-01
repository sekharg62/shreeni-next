import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            New Festive Collection 2026
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-dark sm:text-5xl lg:text-6xl">
            Timeless sarees, woven for every occasion
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-muted sm:text-lg lg:mx-0">
            Discover handpicked silk, cotton, and designer sarees crafted by
            master weavers — elegant drapes delivered to your doorstep.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/sarees"
              className="rounded-full bg-primary px-8 py-3 text-base font-medium text-surface transition-opacity hover:opacity-90"
            >
              Shop Collection
            </Link>
            <Link
              href="/collections/new"
              className="rounded-full border border-primary px-8 py-3 text-base font-medium text-primary transition-colors hover:bg-primary hover:text-surface"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Visual placeholder */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/90 via-primary to-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-7xl font-semibold text-surface/90">
              Shreeni
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
