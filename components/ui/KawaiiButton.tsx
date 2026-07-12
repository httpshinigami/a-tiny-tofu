import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "sage";

const styles: Record<Variant, string> = {
  primary: "bg-pink text-ink hover:bg-pink/80",
  sage: "bg-pink text-ink hover:bg-pink/80",
  secondary: "bg-pink text-ink hover:bg-pink/80",
  ghost: "bg-transparent text-ink hover:bg-pink/40",
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
    "inline-flex items-center justify-center rounded-md px-6 py-3 font-display text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:opacity-50";

  const cn = `${base} ${styles[variant]} ${className}`;

  if (href) {
    const isExternal = /^https?:\/\//i.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn}
        >
          {children}
        </a>
      );
    }
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
