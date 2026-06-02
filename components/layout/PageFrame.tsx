import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageFrame({ children, className = "" }: Props) {
  return (
    <div
      className={`mx-auto w-full max-w-5xl flex-1 rounded-[2rem] border-4 border-white/50 bg-cream p-6 shadow-xl md:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
