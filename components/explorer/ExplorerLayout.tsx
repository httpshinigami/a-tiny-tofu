"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";

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

export function ExplorerLayout(props: Props) {
  return (
    <Suspense fallback={<ExplorerLayoutShell {...props} mobileView="map" />}>
      <ExplorerLayoutWithSearchParams {...props} />
    </Suspense>
  );
}

function ExplorerLayoutWithSearchParams(props: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobileView: MobileView =
    searchParams.get("view") === "list" ? "list" : "map";

  function setMobileView(next: MobileView) {
    if (next === mobileView) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", next);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    // If user selected from list, switch to map and create a history step.
    if (props.detailKey && mobileView === "list") {
      setMobileView("map");
    }
  }, [props.detailKey, mobileView]);

  return (
    <ExplorerLayoutShell {...props} mobileView={mobileView} setMobileView={setMobileView} />
  );
}

function ExplorerLayoutShell({
  sidebar,
  map,
  renderDetail,
  filterToggle,
  filterPanel,
  hasDetail = false,
  mobileView,
  setMobileView,
}: Props & {
  mobileView: MobileView;
  setMobileView?: (view: MobileView) => void;
}) {
  return (
    <div className="flex w-full min-h-full flex-col md:flex-row md:items-start">
      {/* Desktop list: flush left; stays in view while the page scrolls */}
      <aside
        className={`hidden w-[min(340px,32vw)] shrink-0 flex-col border-r border-border bg-surface md:flex ${STICKY_PANEL}`}
        aria-label="List"
      >
        {sidebar}
      </aside>

      {/* Center: map */}
      <div
        className={`flex min-h-0 min-w-0 flex-col px-3 pt-2 pb-4 md:flex-1 md:px-8 md:pt-6 md:pb-6 lg:px-10 ${STICKY_PANEL}`}
      >
        {filterToggle && (
          <div className="mb-3 flex w-full shrink-0 flex-col gap-2 md:mb-4">
            {filterToggle}
          </div>
        )}

        <div
          className="mb-2 flex w-full shrink-0 rounded-md border border-border bg-surface p-1 md:hidden"
          role="tablist"
          aria-label="View mode"
        >
          <ViewTab
            active={mobileView === "list"}
            onClick={() => setMobileView?.("list")}
          >
            List
          </ViewTab>
          <ViewTab
            active={mobileView === "map"}
            onClick={() => setMobileView?.("map")}
          >
            Map
          </ViewTab>
        </div>

        <div
          className={`relative mx-auto w-full max-w-[68rem] grid grid-cols-1 grid-rows-1 gap-0 border-y border-border bg-surface md:min-h-0 md:flex-1 md:border md:border-border ${
            mobileView === "list"
              ? "h-[min(65dvh,560px)] min-h-[360px]"
              : "h-[min(36dvh,280px)]"
          }`}
        >
          {/* Filter popup over the map (does not push layout) */}
          {filterPanel && (
            <div className="absolute inset-x-3 top-3 z-20 max-h-[min(92%,48rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-lg md:inset-x-auto md:left-4 md:top-4 md:w-[min(100%-2rem,34rem)]">
              {filterPanel}
            </div>
          )}

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

      {/* Desktop info: sticky+centered when empty; natural height when selected */}
      <aside
        className={`hidden w-[22rem] shrink-0 flex-col px-4 py-6 mr-6 md:flex lg:w-[24rem] lg:px-5 lg:mr-10 ${
          hasDetail
            ? ""
            : `${STICKY_PANEL} items-center justify-center`
        }`}
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
