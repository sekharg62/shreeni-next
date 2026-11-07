import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HandHeart, Leaf, Truck } from "lucide-react";
import Container from "@/components/Container";
import { siteConfig } from "@/config/siteConfig";

// NOTE: Starter copy. Replace with Shreeni's real story (founder, year, place, people) before launch.

export const metadata: Metadata = {
  title: "Our Story",
  description: `How ${siteConfig.name} brings Bengal's handwoven sarees — Baluchori, Jamdani, Tant and more — from the loom to your wardrobe.`,
};

const VALUES = [
  {
    icon: BadgeCheck,
    title: "Authentic weaves",
    body: "Every saree is chosen for its weave, not its trend. If it says handloom or pure silk, that's exactly what it is.",
  },
  {
    icon: HandHeart,
    title: "Close to the craft",
    body: "We work with weaving families and small workshops across Bengal, so more of what you pay reaches the hands that made it.",
  },
  {
    icon: Leaf,
    title: "Made to last",
    body: "A good saree is passed down, not thrown away. We choose pieces built to be worn for years and loved for longer.",
  },
  {
    icon: Truck,
    title: "Care, end to end",
    body: "Checked by hand, folded with care and packed so it arrives the way it left the loom — with real people to help if it doesn't.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Our Story</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-dark sm:text-5xl">
              Woven in Bengal, made to be treasured
            </h1>
            <div className="mx-auto mt-6 h-0.5 w-16 bg-secondary" />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {siteConfig.name} began with a simple wish: to make the sarees we grew up admiring — the storytelling
              pallus of Baluchori, the airy grace of Jamdani, the everyday comfort of Tant — easy to find, honestly
              described, and fairly priced.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-primary">Where it began</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted">
                <p>
                  From {siteConfig.location.city}, we saw how many beautiful weaves never travelled beyond their
                  villages, and how hard it was to know whether a &ldquo;silk&rdquo; or &ldquo;handloom&rdquo; saree
                  bought online was the real thing.
                </p>
                <p>
                  So we went to the source. We spend our time with weavers and small workshops, learning what makes
                  each weave special and choosing only the pieces we would gift to our own families.
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-semibold text-primary">What we do today</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted">
                <p>
                  We curate sarees from across Bengal, describe each one plainly — fabric, weave, size and care — and
                  photograph them as they really look.
                </p>
                <p>
                  Behind every order is a small team that checks each saree by hand before it ships, and stays with
                  you after it arrives.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">What we stand for</h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
          </div>
          <ul className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-lg border border-border bg-background p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-dark">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Quote */}
      <section className="py-20 sm:py-24">
        <Container>
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="font-serif text-2xl leading-relaxed text-dark sm:text-3xl">
              &ldquo;A saree is never just six yards of fabric. It carries a weaver&apos;s patience, a region&apos;s
              history, and the memories of everyone who wears it.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold uppercase tracking-wider text-secondary">
              The {siteConfig.name} team
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-surface">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="font-serif text-2xl font-semibold sm:text-3xl">See the craft up close</h2>
              <p className="mt-2 text-surface/80">Discover the weaves we love and how they&apos;re made.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about/craftsmanship"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-surface/60 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-surface hover:text-primary"
              >
                Our craftsmanship
              </Link>
              <Link
                href="/sarees/handloom"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-background"
              >
                Shop handloom <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
