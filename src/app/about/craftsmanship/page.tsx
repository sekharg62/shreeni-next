import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Droplets, Layers, Scissors, Search, Sparkles, Spline, Sun, Wind } from "lucide-react";
import Container from "@/components/Container";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata } from "@/lib/seo";

// NOTE: Starter copy describing the weaves in general terms. Have it reviewed (and add real
// photos of your weavers and looms) before launch.

export const metadata: Metadata = pageMetadata({
  title: "Craftsmanship",
  description:
    "The handwoven traditions behind every Shreeni saree — Baluchori, Swarnachori, Jamdani, Tant, Kantha and Bengal silks — and how they are made.",
  path: "/about/craftsmanship",
});

const WEAVES = [
  {
    name: "Baluchori",
    slug: "baluchori",
    origin: "Bishnupur, Bankura",
    body: "Silk sarees whose pallus tell stories — scenes from epics and temple life woven thread by thread into the fabric.",
  },
  {
    name: "Swarnachori",
    slug: "swarnachori",
    origin: "Bishnupur, Bankura",
    body: "Baluchori's festive sibling, with gold-toned zari lighting up the motifs for weddings and celebrations.",
  },
  {
    name: "Jamdani",
    slug: "jamdani",
    origin: "Bengal",
    body: "Fine, airy cotton with motifs that seem to float, added by hand on the loom one pattern thread at a time.",
  },
  {
    name: "Tant",
    slug: "tant",
    origin: "Shantipur & Phulia, Nadia",
    body: "Bengal's everyday cotton: light, crisp and cool, with bold borders made for warm days.",
  },
  {
    name: "Kantha Stitch",
    slug: "kantha-stitch",
    origin: "Bengal",
    body: "Layers of running stitch embroidered entirely by hand, turning simple fabric into texture and pattern.",
  },
  {
    name: "Murshidabad Silk",
    slug: "murshidabad-silk",
    origin: "Murshidabad",
    body: "Soft, lustrous mulberry silk that drapes beautifully and takes rich prints and dyes.",
  },
  {
    name: "Bishnupuri Silk",
    slug: "bishnupuri-silk",
    origin: "Bishnupur, Bankura",
    body: "Smooth, light silk from the temple town of Bishnupur, elegant enough for occasions and easy to wear.",
  },
  {
    name: "Handloom",
    slug: "handloom",
    origin: "Across Bengal",
    body: "Woven on hand-operated looms, with the small irregularities that show a person, not a machine, made it.",
  },
];

const STEPS = [
  { icon: Spline, title: "Yarn", body: "Cotton or silk yarn is chosen for its count and feel, then cleaned and prepared." },
  { icon: Droplets, title: "Dyeing", body: "Yarns are dyed in small batches, so each colour is checked by eye." },
  { icon: Layers, title: "Warping", body: "Thousands of threads are set on the loom by hand — often a full day's work." },
  { icon: Sparkles, title: "Weaving", body: "The weaver builds the body, border and pallu, adding motifs one pass at a time." },
  { icon: Search, title: "Finishing", body: "Every saree is checked, finished and folded by hand before it reaches you." },
];

const SIGNS = [
  "Tiny irregularities in the weave — a sign of hands at work, not a flaw.",
  "Motifs look the same on both sides in many handwoven sarees (especially Jamdani).",
  "The fabric feels alive: it breathes, softens with wear and drapes naturally.",
];

const CARE = [
  { icon: Wind, text: "Dry-clean silks and zari sarees; hand-wash cottons in cold water with mild soap." },
  { icon: Sun, text: "Dry in the shade — strong sunlight fades natural dyes." },
  { icon: Scissors, text: "Refold every few months so creases don't weaken the threads." },
  { icon: Layers, text: "Store in a cotton or muslin cloth, never plastic, so the fabric can breathe." },
];

export default function CraftsmanshipPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Craftsmanship</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-dark sm:text-5xl">
              Every thread, placed by hand
            </h1>
            <div className="mx-auto mt-6 h-0.5 w-16 bg-secondary" />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Bengal&apos;s weaving traditions have been passed from one generation to the next for centuries. Here are
              the weaves we bring to {siteConfig.name}, and the patient work behind each one.
            </p>
          </div>
        </Container>
      </section>

      {/* Weaves */}
      <section className="py-20 sm:py-24" aria-labelledby="weaves-heading">
        <Container>
          <div className="text-center">
            <h2 id="weaves-heading" className="font-serif text-3xl font-semibold text-primary sm:text-4xl">
              The weaves we love
            </h2>
            <p className="mt-3 text-muted">Tap a weave to see the sarees we have in it.</p>
          </div>
          <ul className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WEAVES.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/sarees/${w.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary">{w.origin}</p>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-dark">{w.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{w.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Shop {w.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-surface py-20 sm:py-24" aria-labelledby="process-heading">
        <Container>
          <div className="text-center">
            <h2 id="process-heading" className="font-serif text-3xl font-semibold text-primary sm:text-4xl">
              From yarn to saree
            </h2>
            <p className="mt-3 text-muted">A single handwoven saree can take days, sometimes weeks, to finish.</p>
          </div>
          <ol className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative rounded-lg border border-border bg-background p-6">
                <span className="absolute right-4 top-4 font-serif text-3xl font-semibold text-primary/15" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-dark">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Handloom signs + care */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-primary">How to recognise a handwoven saree</h2>
              <ul className="mt-6 space-y-4">
                {SIGNS.map((s) => (
                  <li key={s} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-semibold text-primary">Caring for your saree</h2>
              <ul className="mt-6 space-y-4">
                {CARE.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex gap-3 leading-relaxed text-muted">
                    <Icon className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-surface">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Wear a piece of Bengal&apos;s heritage</h2>
              <p className="mt-2 text-surface/80">Find the weave that feels like you.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about/story"
                className="inline-flex items-center justify-center rounded-full border border-surface/60 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-surface hover:text-primary"
              >
                Our story
              </Link>
              <Link
                href="/sarees/baluchori"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-background"
              >
                Shop Baluchori <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
