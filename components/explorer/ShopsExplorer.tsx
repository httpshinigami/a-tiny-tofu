"use client";

import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { ExplorerPageShell } from "@/components/explorer/ExplorerPageShell";
import { ShopDetailPanel } from "@/components/explorer/ShopDetailPanel";
import { ShopFilterPanel } from "@/components/explorer/ShopFilterPanel";
import { DynamicShopMap } from "@/components/maps/DynamicShopMap";
import { SHOP_TAG_LABELS, type ShopTag } from "@/lib/constants";
import { filterShopsByAllTags } from "@/lib/shop-categories";
import type { ShopFilterCategory } from "@/lib/shop-filter-categories";
import type { Shop } from "@/lib/types";
import { useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes } from "react";

type LocationFilter = "VIC" | "NSW";

const LOCATION_OPTIONS: { id: LocationFilter; label: string }[] = [
  { id: "VIC", label: "Victoria" },
  { id: "NSW", label: "NSW" },
];

function shopMatchesLocations(
  shop: Shop,
  locations: LocationFilter[]
): boolean {
  if (locations.length === 0) return true;
  const addr = shop.address.toLowerCase();
  return locations.some((loc) => {
    if (loc === "VIC") {
      return (
        /\bvic\b/.test(addr) ||
        /\bvictoria\b(?=\s*,?\s*(?:\d{4}\b|australia\b|$))/.test(addr)
      );
    }
    return (
      /\bnsw\b/.test(addr) ||
      /\bnew south wales\b/.test(addr)
    );
  });
}

interface Props {
  shops: Shop[];
  filterTags: readonly ShopTag[];
  filterCategories?: readonly ShopFilterCategory[];
  emptyMessage: string;
  /** Open filters by default on desktop only; mobile always starts closed. */
  filterOpenByDefault?: boolean;
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
  const [locationOpen, setLocationOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpenByDefault) return;
    const mq = window.matchMedia("(min-width: 768px)");
    setFilterOpen(mq.matches);
  }, [filterOpenByDefault]);

  useEffect(() => {
    if (searchOpen) mobileSearchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!locationOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLocationOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (!locationMenuRef.current?.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [locationOpen]);

  const categories = useMemo(
    () =>
      filterCategories ??
      [{ label: "Type", tags: filterTags }] satisfies ShopFilterCategory[],
    [filterCategories, filterTags]
  );

  const filtered = useMemo(() => {
    let list = filterShopsByAllTags(shops, activeTags).filter((shop) =>
      shopMatchesLocations(shop, locations)
    );
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((shop) => {
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
  }, [shops, activeTags, locations, search]);

  const effectiveSelectedId =
    selectedId && filtered.some((s) => s.id === selectedId)
      ? selectedId
      : null;

  const selected =
    filtered.find((s) => s.id === effectiveSelectedId) ?? null;

  function openSearch() {
    setFilterOpen(false);
    setLocationOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearch("");
    setSearchOpen(false);
  }

  function removeTag(tag: ShopTag) {
    setActiveTags((prev) => prev.filter((t) => t !== tag));
  }

  function toggleLocation(id: LocationFilter) {
    setLocations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
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
                onClick={() => setSelectedId(shop.id)}
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
    <div className="relative" ref={locationMenuRef}>
      <PillButton
        active={locationOpen || locations.length > 0}
        aria-expanded={locationOpen}
        aria-haspopup="listbox"
        onClick={() => {
          setLocationOpen((v) => !v);
          setFilterOpen(false);
        }}
      >
        <span>
          {locations.length === 0
            ? "Location"
            : locations.length === 1
              ? LOCATION_OPTIONS.find((o) => o.id === locations[0])?.label
              : `Location · ${locations.length}`}
        </span>
        <ChevronDown />
        {locations.length > 0 && (
          <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            {locations.length}
          </span>
        )}
      </PillButton>
      {locationOpen && (
        <div
          className="absolute left-0 top-full z-30 mt-2 w-52 rounded-2xl border border-border bg-surface p-3 shadow-lg"
          role="listbox"
          aria-label="Location"
        >
          <ul className="space-y-1">
            {LOCATION_OPTIONS.map((option) => {
              const checked = locations.includes(option.id);
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggleLocation(option.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      checked
                        ? "bg-pink/40 font-semibold text-ink"
                        : "text-ink hover:bg-surface/80"
                    }`}
                  >
                    {option.label}
                    {checked && <span aria-hidden>✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          {locations.length > 0 && (
            <button
              type="button"
              onClick={() => setLocations([])}
              className="mt-2 w-full text-left text-xs font-medium text-sage-dark underline"
            >
              Clear location
            </button>
          )}
        </div>
      )}
    </div>
  );

  const filtersButton = (
    <PillButton
      active={filterOpen || activeTags.length > 0}
      aria-expanded={filterOpen}
      aria-label={filterOpen ? "Close filters" : "Show filters"}
      onClick={() => {
        setFilterOpen((v) => !v);
        setLocationOpen(false);
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
      <div className="flex w-full items-center gap-2">
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
            {locationButton}
            {filtersButton}
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
            <ShopFilterPanel
              categories={categories}
              selected={activeTags}
              onChange={setActiveTags}
              onClose={() => setFilterOpen(false)}
            />
          ) : null
        }
        sidebar={sidebar}
        map={
          <DynamicShopMap
            shops={filtered}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
          />
        }
        renderDetail={() => <ShopDetailPanel shop={selected} />}
        hasDetail={!!selected}
        detailKey={effectiveSelectedId}
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
