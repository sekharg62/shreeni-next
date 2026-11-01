import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ViewAllButtonProps = {
  href: string;
  label?: string;
  variant?: "dark" | "light";
};

export default function ViewAllButton({
  href,
  label = "View All",
  variant = "dark",
}: ViewAllButtonProps) {
  let styles: string;
  switch (variant) {
    case "light":
      styles = "border-surface text-surface hover:bg-surface hover:text-primary";
      break;
    case "dark":
    default:
      styles = "border-primary text-primary hover:bg-primary hover:text-surface";
      break;
  }

  return (
    <div className="mt-12 flex justify-center">
      <Link
        href={href}
        className={`group inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${styles}`}
      >
        {label}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
