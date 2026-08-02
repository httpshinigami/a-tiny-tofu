import type { ReactNode } from "react";

/** Fills the main area down to the footer, and grows with tall content. */
export function ExplorerPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate w-full min-h-full flex-1 shrink-0">
      <div
        className="mint-polka pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      />
      <div className="relative min-h-full">{children}</div>
    </div>
  );
}
