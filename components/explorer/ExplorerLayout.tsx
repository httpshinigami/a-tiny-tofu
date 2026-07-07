import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  sidebar: ReactNode;
  map: ReactNode;
  detail: ReactNode;
  headerExtra?: ReactNode;
  filterPanel?: ReactNode;
}

export function ExplorerLayout({
  title,
  subtitle,
  sidebar,
  map,
  detail,
  headerExtra,
  filterPanel,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-periwinkle md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-ink-muted">{subtitle}</p>
          )}
        </div>
        {headerExtra}
      </div>

      <div className="relative w-full">
        {filterPanel && (
          <div className="mb-4 w-full md:absolute md:inset-y-0 md:right-full md:mb-0 md:mr-4 md:w-64 lg:w-72">
            {filterPanel}
          </div>
        )}

        <div className="grid min-h-[640px] w-full gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm md:grid-cols-[minmax(220px,280px)_1fr] md:p-5">
          <aside className="flex max-h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-cream md:max-h-none md:min-h-[600px]">
            {sidebar}
          </aside>
          <div className="flex min-h-0 flex-col gap-4">
            <div className="min-h-[280px] flex-1 md:min-h-[320px]">{map}</div>
            <div className="shrink-0 rounded-xl border border-border bg-cream p-4 md:p-5">
              {detail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
