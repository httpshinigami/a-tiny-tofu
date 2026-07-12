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
      {children}
    </div>
  );
}
