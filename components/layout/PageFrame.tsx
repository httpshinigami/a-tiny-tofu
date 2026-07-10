import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageFrame({ children, className = "max-w-5xl" }: Props) {
  return (
    <div
      className={`mx-auto w-full flex-1 px-4 py-8 md:px-8 md:py-10 ${className}`}
    >
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-10">
        {children}
      </div>
    </div>
  );
}
