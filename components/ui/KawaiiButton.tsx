import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-coral text-white shadow-md hover:bg-coral-dark border-2 border-transparent",
  secondary:
    "bg-white text-coral border-2 border-coral hover:bg-cream",
  ghost: "bg-transparent text-ink hover:bg-peach/30 border-2 border-transparent",
};

interface Props {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function KawaiiButton({
  href,
  onClick,
  type = "button",
  variant = "primary",
  children,
  className = "",
  disabled,
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 font-display text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:opacity-50";

  const cn = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cn}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
