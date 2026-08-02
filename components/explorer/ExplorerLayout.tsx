"use client";

import { useEffect, useState, type ReactNode } from "react";

type MobileView = "list" | "map";

/** Approx. header+footer so sticky list/map fill the main area between them. */
const STICKY_PANEL =
  "md:sticky md:top-0 md:h-[calc(100dvh-10rem)] md:max-h-[calc(100dvh-10rem)]";

interface Props {
  sidebar: ReactNode;
  map: ReactNode;
  /** Called for desktop panel and mobile section separately. */
  renderDetail: () => ReactNode;
  filterToggle?: ReactNode;
  filterPanel?: ReactNode;
  /** When true, mobile shows details under the map. */
  hasDetail?: boolean;
  /** Changes when selection changes — switches mobile view to map. */
  detailKey?: string | null;
}

export function ExplorerLayout({
  sidebar,
  map,
  renderDetail,
  filterToggle,
  filterPanel,
  hasDetail = false,
  detailKey = null,
}: Props) {
  const [mobileView, setMobileView] = useState<MobileView>("map");

  useEffect(() => {
    if (detailKey) setMobileView("map");
  }, [detailKey]);

  return (
    <div className="flex w-full min-h-full flex-col md:flex-row md:items-start">
      {/* Desktop list: flush left; stays in view while the page scrolls */}
      <aside
        className={`hidden w-[min(300px,30vw)] shrink-0 flex-col border-r border-border bg-surface md:flex ${STICKY_PANEL}`}
        aria-label="List"
      >
        {sidebar}
      </aside>

      {/* Center: map */}
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col px-3 pt-2 pb-4 md:px-8 md:pt-6 md:pb-6 lg:px-10 ${STICKY_PANEL}`}
      >
        {(filterToggle || filterPanel) && (
          <div className="mb-3 flex w-full shrink-0 flex-col gap-2 md:mb-4">
            {filterToggle}
            {filterPanel}
          </div>
        )}

        <div
          className="mb-2 flex w-full shrink-0 rounded-md border border-border bg-surface p-1 md:hidden"
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
          className={`relative mx-auto min-h-0 w-full max-w-[68rem] flex-1 grid grid-cols-1 grid-rows-1 gap-0 border-y border-border bg-surface md:border md:border-border ${
            mobileView === "list"
              ? "min-h-[360px]"
              : "min-h-[280px] md:min-h-0"
          }`}
        >
          {/* Mobile list only */}
          <aside
            className={`col-start-1 row-start-1 flex min-h-0 flex-col overflow-hidden md:hidden ${
              mobileView === "list"
                ? "z-[1]"
                : "pointer-events-none invisible"
            }`}
          >
            {sidebar}
          </aside>

          <div
            className={`col-start-1 row-start-1 min-h-0 overflow-hidden md:relative ${
              mobileView === "map"
                ? "z-[1]"
                : "pointer-events-none invisible md:pointer-events-auto md:visible"
            }`}
          >
            {map}
          </div>
        </div>

        {hasDetail && mobileView === "map" && (
          <div
            className="mt-5 shrink-0 border-t border-border pt-5 md:hidden"
            aria-label="Details"
          >
            {renderDetail()}
          </div>
        )}
      </div>

      {/* Desktop info + embed: page scroll, no inner scrollbar */}
      <aside
        className="hidden w-[17.5rem] shrink-0 flex-col px-4 py-6 mr-6 md:flex lg:w-[19rem] lg:px-5 lg:mr-10"
        aria-label="Details"
      >
        {renderDetail()}
      </aside>
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
        active ? "bg-pink text-ink" : "text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
