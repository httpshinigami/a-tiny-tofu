import { toSafeHttpHref } from "@/lib/safe-url";
import type { ReactNode } from "react";

interface Props {
  href: string | null | undefined;
  children: ReactNode;
  className?: string;
}

/** Renders an external link only when the href is a safe http(s) URL. */
export function SafeExternalLink({ href, children, className }: Props) {
  const safeHref = toSafeHttpHref(href);
  if (!safeHref) return null;

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
