type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={[
        "max-w-2xl",
        isCenter ? "mx-auto text-center" : "text-left",
      ].join(" ")}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 font-serif text-3xl font-semibold text-dark sm:text-4xl">
        {title}
      </h2>

      {/* Gold accent rule */}
      <div
        className={[
          "mt-4 h-0.5 w-16 bg-secondary",
          isCenter ? "mx-auto" : "",
        ].join(" ")}
      />

      {subtitle && (
        <p className="mt-5 text-muted sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
