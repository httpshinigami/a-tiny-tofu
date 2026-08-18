"use client";

import {
  ExplorerLayout,
  pushMobileView,
} from "@/components/explorer/ExplorerLayout";
import { ExplorerPageShell } from "@/components/explorer/ExplorerPageShell";
import { LocationFilterMenu } from "@/components/explorer/LocationFilterMenu";
import { ShopDetailPanel } from "@/components/explorer/ShopDetailPanel";
import { ShopFilterPanel } from "@/components/explorer/ShopFilterPanel";
import { DynamicShopMap } from "@/components/maps/DynamicShopMap";
import {
  LOCATION_FILTER_OPTIONS,
  matchesLocationFilter,
  type LocationFilter,
} from "@/lib/au-state";
import { SHOP_TAG_LABELS, type ShopTag } from "@/lib/constants";
import { filterShopsByAllTags } from "@/lib/shop-categories";
import type { ShopFilterCategory } from "@/lib/shop-filter-categories";
import type { Shop } from "@/lib/types";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import type { LocationFilterMenuHandle } from "@/components/explorer/LocationFilterMenu";

interface Props {
  shops: Shop[];
  filterTags: readonly ShopTag[];
  filterCategories?: readonly ShopFilterCategory[];
  emptyMessage: string;
  /** Open filters by default on desktop only; mobile always starts closed. */
  filterOpenByDefault?: boolean;
}

function filterShopsBySearch(shops: Shop[], query: string): Shop[] {
  const q = query.trim().toLowerCase();
  if (!q) return shops;
  return shops.filter((shop) => {
    const tagLabels = shop.shop_tags
      .map((t) => SHOP_TAG_LABELS[t])
      .join(" ")
      .toLowerCase();
    return (
      shop.name.toLowerCase().includes(q) ||
      shop.address.toLowerCase().includes(q) ||
      tagLabels.includes(q)
    );
  });
}

export function ShopsExplorer({
  shops,
  filterTags,
  filterCategories,
  emptyMessage,
  filterOpenByDefault = false,
}: Props) {
  const [activeTags, setActiveTags] = useState<ShopTag[]>([]);
  const [locations, setLocations] = useState<LocationFilter[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const locationFilterRef = useRef<HTMLDivElement>(null);
  const filtersButtonRef = useRef<HTMLDivElement>(null);
  const locationMenuRef = useRef<LocationFilterMenuHandle>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpenByDefault) return;
    const mq = window.matchMedia("(min-width: 768px)");
    setFilterOpen(mq.matches);
  }, [filterOpenByDefault]);

  useEffect(() => {
    if (searchOpen) mobileSearchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!filterOpen || searchOpen) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (filterPanelRef.current?.contains(target)) return;
      if (locationFilterRef.current?.contains(target)) return;
      if (filtersButtonRef.current?.contains(target)) return;
      setFilterOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [filterOpen, searchOpen]);

  function closeFilterChrome() {
    locationMenuRef.current?.close();
    setFilterOpen(false);
  }

  const categories = useMemo(
    () =>
      filterCategories ??
      [{ label: "Type", tags: filterTags }] satisfies ShopFilterCategory[],
    [filterCategories, filterTags]
  );

  const tagFiltered = useMemo(
    () => filterShopsByAllTags(shops, activeTags),
    [shops, activeTags]
  );

  const searchFiltered = useMemo(
    () => filterShopsBySearch(tagFiltered, search),
    [tagFiltered, search]
  );

  const locationCounts = useMemo(
    () =>
      Object.fromEntries(
        LOCATION_FILTER_OPTIONS.map((option) => [
          option.id,
          searchFiltered.filter((shop) =>
            matchesLocationFilter(shop.state, shop.address, [option.id])
          ).length,
        ])
      ) as Partial<Record<LocationFilter, number>>,
    [searchFiltered]
  );

  const filtered = useMemo(
    () =>
      searchFiltered.filter((shop) =>
        matchesLocationFilter(shop.state, shop.address, locations)
      ),
    [searchFiltered, locations]
  );

  const effectiveSelectedId =
    selectedId && filtered.some((s) => s.id === selectedId)
      ? selectedId
      : null;

  const selected =
    filtered.find((s) => s.id === effectiveSelectedId) ?? null;

  function toggleSelectShop(id: string) {
    const selecting = selectedId !== id;
    setSelectedId(selecting ? id : null);
    if (selecting) pushMobileView("map");
  }

  function openSearch() {
    setFilterOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearch("");
    setSearchOpen(false);
  }

  function removeTag(tag: ShopTag) {
    setActiveTags((prev) => prev.filter((t) => t !== tag));
  }

  const sidebar = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="hidden shrink-0 border-b border-border p-3 md:block">
        <label htmlFor="shop-search" className="sr-only">
          Search shops
        </label>
        <input
          id="shop-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops…"
          className="kawaii-input py-2 text-base md:text-sm"
        />
      </div>
      <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <li className="text-sm text-ink-muted">{emptyMessage}</li>
        ) : (
          filtered.map((shop) => (
            <li key={shop.id}>
              <button
                type="button"
                onClick={() => toggleSelectShop(shop.id)}
                className={`min-h-11 w-full px-2 py-3 text-left transition ${
                  effectiveSelectedId === shop.id
                    ? "bg-pink/50 font-semibold text-pink-dark"
                    : "text-ink hover:bg-surface/80"
                }`}
              >
                <span className="font-display">{shop.name}</span>
                {activeTags.length > 0 && (
                  <p className="mt-0.5 truncate text-xs font-normal text-ink-muted">
                    {shop.shop_tags
                      .filter((t) => activeTags.includes(t))
                      .map((t) => SHOP_TAG_LABELS[t])
                      .join(", ")}
                  </p>
                )}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  const locationButton = (
    <LocationFilterMenu
      ref={locationMenuRef}
      value={locations}
      onChange={setLocations}
      optionCounts={locationCounts}
      onOpen={() => setFilterOpen(false)}
      renderButton={({ active, label, onClick, open }) => (
        <PillButton
          active={active}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={onClick}
        >
          <span>{label}</span>
          <ChevronDown />
        </PillButton>
      )}
    />
  );

  const filtersButton = (
    <PillButton
      active={filterOpen || activeTags.length > 0}
      aria-expanded={filterOpen}
      aria-label={filterOpen ? "Close filters" : "Show filters"}
      onClick={() => {
        setFilterOpen((v) => !v);
      }}
    >
      <FiltersIcon />
      <span>Filters</span>
      {activeTags.length > 0 && (
        <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {activeTags.length}
        </span>
      )}
    </PillButton>
  );

  const filterToggle = (
    <div className="flex w-full flex-col gap-2">
      <div
        className="flex w-full items-center gap-2"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) closeFilterChrome();
        }}
      >
        {searchOpen ? (
          <div className="flex w-full items-center gap-2 md:hidden">
            <label htmlFor="shop-search-mobile" className="sr-only">
              Search shops
            </label>
            <input
              ref={mobileSearchRef}
              id="shop-search-mobile"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") closeSearch();
              }}
              placeholder="Search shops…"
              className="kawaii-input min-h-11 min-w-0 flex-1 py-2 text-base"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="inline-flex min-h-11 shrink-0 items-center px-3 text-sm font-medium text-ink-muted hover:text-ink"
              aria-label="Close search"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div ref={locationFilterRef}>{locationButton}</div>
            <div ref={filtersButtonRef}>{filtersButton}</div>
            <button
              type="button"
              onClick={openSearch}
              className="ml-auto inline-flex size-11 items-center justify-center text-ink transition hover:text-sage-dark md:hidden"
              aria-label="Search shops"
            >
              <SearchIcon />
            </button>
          </>
        )}
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-sage/15 px-2.5 py-1.5 text-xs font-semibold text-sage-dark transition hover:bg-sage/25"
              aria-label={`Remove ${SHOP_TAG_LABELS[tag]} filter`}
            >
              {SHOP_TAG_LABELS[tag]}
              <span aria-hidden className="text-sm leading-none">
                ×
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ExplorerPageShell>
      <ExplorerLayout
        filterToggle={filterToggle}
        filterPanel={
          filterOpen && !searchOpen ? (
            <div ref={filterPanelRef}>
              <ShopFilterPanel
                categories={categories}
                selected={activeTags}
                onChange={setActiveTags}
                onClose={() => setFilterOpen(false)}
              />
            </div>
          ) : null
        }
        sidebar={sidebar}
        map={
          <DynamicShopMap
            shops={filtered}
            selectedId={effectiveSelectedId}
            onSelect={toggleSelectShop}
          />
        }
        renderDetail={() => <ShopDetailPanel shop={selected} />}
        hasDetail={!!selected}
      />
    </ExplorerPageShell>
  );
}

function PillButton({
  active,
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition md:min-h-0 ${
        active
          ? "border-ink shadow-sm"
          : "border-border hover:border-ink/50 hover:bg-white"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function FiltersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M2 4.5h8.5M12.5 4.5H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="11" cy="4.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 11.5h3.5M7.5 11.5H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="6" cy="11.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-ink-muted"
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

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 256 256"
      className="shrink-0"
      aria-hidden
    >
      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
    </svg>
  );
}
