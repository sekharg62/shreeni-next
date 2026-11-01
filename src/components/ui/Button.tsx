import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-60";

  let variantStyles: string;
  switch (variant) {
    case "outline":
      variantStyles =
        "border border-primary text-primary hover:bg-primary hover:text-surface";
      break;
    case "ghost":
      variantStyles = "text-primary hover:bg-background";
      break;
    case "primary":
    default:
      variantStyles = "bg-primary text-surface hover:bg-dark";
      break;
  }

  let sizeStyles: string;
  switch (size) {
    case "sm":
      sizeStyles = "px-4 py-2 text-xs";
      break;
    case "lg":
      sizeStyles = "px-8 py-3.5 text-sm";
      break;
    case "md":
    default:
      sizeStyles = "px-6 py-3 text-sm";
      break;
  }

  return (
    <button
      className={`${base} ${variantStyles} ${sizeStyles} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
