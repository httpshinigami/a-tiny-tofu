"use client";

import { useEffect, useState, type ReactNode } from "react";

type MobileView = "list" | "map";
const MOBILE_VIEW_EVENT = "tinytofu:mobile-view-change";

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
}

function getMobileViewFromSearch(search: string): MobileView {
  const params = new URLSearchParams(search);
  return params.get("view") === "list" ? "list" : "map";
}

export function pushMobileView(next: MobileView) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  params.set("view", next);
  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.pushState({ mobileView: next }, "", nextUrl);
  window.dispatchEvent(new CustomEvent(MOBILE_VIEW_EVENT));
}

export function ExplorerLayout(props: Props) {
  const [mobileView, setMobileView] = useState<MobileView>("map");

  useEffect(() => {
    const sync = () => setMobileView(getMobileViewFromSearch(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener(MOBILE_VIEW_EVENT, sync as EventListener);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(MOBILE_VIEW_EVENT, sync as EventListener);
    };
  }, []);

  return <ExplorerLayoutShell {...props} mobileView={mobileView} />;
}

function ExplorerLayoutShell({
  sidebar,
  map,
  renderDetail,
  filterToggle,
  filterPanel,
  hasDetail = false,
  mobileView,
}: Props & {
  mobileView: MobileView;
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

      <MobileViewToggle mobileView={mobileView} />
    </div>
  );
}

function MobileViewToggle({ mobileView }: { mobileView: MobileView }) {
  const nextView: MobileView = mobileView === "list" ? "map" : "list";
  const label = nextView === "map" ? "Map" : "List";

  return (
    <button
      type="button"
      onClick={() => pushMobileView(nextView)}
      aria-label={`Switch to ${label.toLowerCase()} view`}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-50 flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-lg transition hover:bg-pink md:hidden"
    >
      {nextView === "map" ? <MapIcon /> : <ListIcon />}
      {label}
    </button>
  );
}

function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden
    >
      <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden
    >
      <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" />
    </svg>
  );
}
