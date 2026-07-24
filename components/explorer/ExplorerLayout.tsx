"use client";

import { useEffect, useState, type ReactNode } from "react";

type MobileView = "list" | "map";

interface Props {
  title: string;
  subtitle?: string;
  sidebar: ReactNode;
  map: ReactNode;
  /** Called for desktop panel and mobile section separately. */
  renderDetail: () => ReactNode;
  headerExtra?: ReactNode;
  filterToggle?: ReactNode;
  filterPanel?: ReactNode;
  leftPanel?: ReactNode;
  /** When true, mobile shows details under the map. */
  hasDetail?: boolean;
  /** Changes when selection changes — switches mobile view to map. */
  detailKey?: string | null;
}

export function ExplorerLayout({
  title,
  subtitle,
  sidebar,
  map,
  renderDetail,
  headerExtra,
  filterToggle,
  filterPanel,
  leftPanel,
  hasDetail = false,
  detailKey = null,
}: Props) {
  const [mobileView, setMobileView] = useState<MobileView>("map");

  useEffect(() => {
    if (detailKey) setMobileView("map");
  }, [detailKey]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-2 pb-6 md:px-8 md:py-8">
      <div className="mb-4 hidden flex-wrap items-end justify-between gap-3 md:mb-6 md:flex md:gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-cocoa md:text-4xl">
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
          <div className="mb-2 flex w-full flex-col gap-2 md:absolute md:inset-y-0 md:right-full md:mb-0 md:mr-6 md:w-[340px] md:min-w-[340px] md:gap-3">
            {filterToggle}
            {filterPanel}
          </div>
        )}
        {leftPanel && (
          <div className="absolute inset-y-0 right-full mr-6 hidden w-[340px] min-w-[340px] md:block">
            {leftPanel}
          </div>
        )}

        <div
          className="mb-2 flex w-full rounded-md border border-border p-1 md:hidden"
          role="tablist"
          aria-label="View mode"
        >
          <ViewTab
            active={mobileView === "list"}
            onClick={() => setMobileView("list")}
          >
            List
          </ViewTab>
          <ViewTab
            active={mobileView === "map"}
            onClick={() => setMobileView("map")}
          >
            Map
          </ViewTab>
        </div>

        <div
          className={`relative grid w-full grid-cols-1 grid-rows-1 gap-0 border-y border-border md:h-[min(70vh,800px)] md:min-h-[480px] md:grid-cols-[minmax(220px,280px)_1fr] md:border md:border-border ${
            mobileView === "list"
              ? "h-[min(75dvh,720px)] min-h-[360px]"
              : "h-[min(52vh,440px)] min-h-[280px]"
          }`}
        >
          <aside
            className={`col-start-1 row-start-1 flex min-h-0 flex-col overflow-hidden border-b border-border md:relative md:col-auto md:row-auto md:border-b-0 md:border-r md:border-border ${
              mobileView === "list"
                ? "z-[1]"
                : "pointer-events-none invisible md:pointer-events-auto md:visible"
            }`}
          >
            {sidebar}
          </aside>
          <div
            className={`col-start-1 row-start-1 min-h-0 overflow-hidden md:relative md:col-auto md:row-auto ${
              mobileView === "map"
                ? "z-[1]"
                : "pointer-events-none invisible md:pointer-events-auto md:visible"
            }`}
          >
            {map}
          </div>
        </div>

        {/* Mobile: details only under the map (not under the list) */}
        {hasDetail && mobileView === "map" && (
          <div
            className="mt-5 border-t border-border pt-5 md:hidden"
            aria-label="Details"
          >
            {renderDetail()}
          </div>
        )}

        {/* Desktop detail column */}
        <div className="mt-6 hidden w-full border-t border-border pt-5 md:absolute md:top-0 md:left-full md:mt-0 md:ml-5 md:block md:h-[min(70vh,800px)] md:min-h-[480px] md:w-64 md:border-t-0 md:border-l md:border-border md:pt-0 md:pl-5 lg:w-72">
          <aside
            className="h-auto max-h-[50vh] w-full overflow-y-auto md:max-h-full"
            aria-label="Details"
          >
            {renderDetail()}
          </aside>
        </div>
      </div>
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-11 flex-1 rounded-sm px-3 text-sm font-semibold transition ${
        active
          ? "bg-peach text-ink"
          : "text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
