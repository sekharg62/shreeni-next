import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

// Single source of truth for page/content width.
// Change `max-w-[1440px]` here and every section updates at once.
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
