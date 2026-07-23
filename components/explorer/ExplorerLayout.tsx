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
  leftPanel?: ReactNode;
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
  leftPanel,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-cocoa md:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-ink-muted">{subtitle}</p>}
        </div>
        {headerExtra}
      </div>

      <div className="relative w-full">
        {(filterToggle || filterPanel) && (
          <div className="mb-4 flex w-full flex-col gap-3 md:absolute md:inset-y-0 md:right-full md:mb-0 md:mr-6 md:w-[340px] md:min-w-[340px]">
            {filterToggle}
            {filterPanel}
          </div>
        )}
        {leftPanel && (
          <div className="absolute inset-y-0 right-full mr-6 hidden w-[340px] min-w-[340px] md:block">
            {leftPanel}
          </div>
        )}

        <div className="grid h-[min(70vh,800px)] min-h-[480px] w-full gap-0 border-y border-border md:grid-cols-[minmax(220px,280px)_1fr] md:border md:border-border">
          <aside className="flex min-h-0 flex-col overflow-hidden border-b border-border md:border-b-0 md:border-r md:border-border">
            {sidebar}
          </aside>
          <div className="min-h-0 overflow-hidden">{map}</div>
        </div>

        <div className="mt-6 w-full border-t border-border pt-5 md:absolute md:top-0 md:left-full md:mt-0 md:ml-5 md:h-[min(70vh,800px)] md:min-h-[480px] md:w-64 md:border-t-0 md:border-l md:border-border md:pt-0 md:pl-5 lg:w-72">
          <aside
            className="h-auto max-h-[50vh] w-full overflow-y-auto md:max-h-full"
            aria-label="Details"
          >
            {detail}
          </aside>
        </div>
      </div>
    </div>
  );
}
