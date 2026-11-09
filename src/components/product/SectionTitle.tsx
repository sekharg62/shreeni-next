/** Heading used by every section below the product: gold eyebrow, serif title, gold diamond rule. */
export default function SectionTitle({
  id,
  eyebrow,
  title,
  align = "left",
}: {
  id: string;
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : undefined}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-serif text-2xl font-semibold text-dark sm:text-3xl">
        {title}
      </h2>
      <span aria-hidden="true" className={`mt-3 flex w-fit items-center gap-1.5 text-secondary ${center ? "mx-auto" : ""}`}>
        <span className="h-px w-8 bg-current" />
        <span className="h-1.5 w-1.5 rotate-45 border border-current" />
        <span className="h-px w-8 bg-current" />
      </span>
    </div>
  );
}
