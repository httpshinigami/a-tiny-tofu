import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  sidebar: ReactNode;
  map: ReactNode;
  detail: ReactNode;
  headerExtra?: ReactNode;
  filterToggle?: ReactNode;
  filterPanel?: ReactNode;
}

export function ExplorerLayout({
  title,
  subtitle,
  sidebar,
  map,
  detail,
  headerExtra,
  filterToggle,
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
        {(filterToggle || filterPanel) && (
          <div className="mb-4 flex w-full flex-col gap-3 md:absolute md:inset-y-0 md:right-full md:mb-0 md:mr-4 md:w-64 lg:w-72">
            {filterToggle}
            {filterPanel}
          </div>
        )}

        <div className="grid h-[min(70vh,800px)] min-h-[480px] w-full gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm md:grid-cols-[minmax(220px,280px)_1fr] md:p-5">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-cream">
            {sidebar}
          </aside>
          <div className="min-h-0 overflow-hidden">{map}</div>
        </div>

        <div className="mt-4 w-full md:absolute md:top-0 md:left-full md:mt-0 md:ml-4 md:h-[min(70vh,800px)] md:min-h-[480px] md:w-64 lg:w-72">
          <aside
            className="h-auto max-h-[50vh] w-full overflow-y-auto rounded-xl border border-border bg-cream shadow-sm md:max-h-full"
            aria-label="Details"
          >
            <div className="p-4 md:p-5">{detail}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
