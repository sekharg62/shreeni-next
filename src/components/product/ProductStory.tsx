import Image from "next/image";

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * "The Story": an editorial split, a photo in the same temple arch as the homepage picks
 * beside the maker's narrative in large italic serif. Renders nothing when there is no story.
 */
export default function ProductStory({ story, image, name }: { story: string | null; image?: string | null; name: string }) {
  if (!story?.trim()) return null;
  return (
    <section
      aria-labelledby="story-heading"
      className="relative overflow-hidden rounded-2xl bg-dark px-6 py-12 text-surface sm:px-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_20%_40%,rgba(184,134,70,0.18),transparent_70%)]"
      />
      <div className={`relative grid items-center gap-10 ${image ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16" : ""}`}>
        {image && (
          <div className="mx-auto w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[360px]">
            <div className="rounded-t-full border border-secondary/45 p-2">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full ring-1 ring-secondary/30">
                <Image src={image} alt="" fill sizes="(max-width: 1024px) 280px, 360px" className="object-cover" />
              </div>
            </div>
          </div>
        )}
        <div className={image ? "text-center lg:text-left" : "mx-auto max-w-3xl text-center"}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Behind the weave</p>
          <h2 id="story-heading" className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
            The Story of {name}
          </h2>
          <span
            aria-hidden="true"
            className={`mt-4 flex w-fit items-center gap-1.5 text-secondary ${image ? "mx-auto lg:mx-0" : "mx-auto"}`}
          >
            <span className="h-px w-8 bg-current" />
            <span className="h-1.5 w-1.5 rotate-45 border border-current" />
            <span className="h-px w-8 bg-current" />
          </span>
          <div className="mt-6 space-y-4 font-serif text-lg italic leading-relaxed text-surface/85 sm:text-xl">
            {paragraphs(story).map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
