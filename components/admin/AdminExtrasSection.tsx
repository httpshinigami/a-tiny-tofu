import type { ReactNode } from "react";

export function AdminExtrasSection({ children }: { children: ReactNode }) {
  return (
    <details className="group rounded-md border border-border">
      <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-ink-muted select-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <Chevron />
          Image link &amp; admin note
        </span>
      </summary>
      <div className="space-y-4 border-t border-border px-3 py-4">{children}</div>
    </details>
  );
}

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-ink-muted/60 transition group-open:rotate-180"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
