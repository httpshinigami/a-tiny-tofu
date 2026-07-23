"use client";

import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { ShopDetailPanel } from "@/components/explorer/ShopDetailPanel";
import { ShopFilterPanel } from "@/components/explorer/ShopFilterPanel";
import { DynamicShopMap } from "@/components/maps/DynamicShopMap";
import { SHOP_TAG_LABELS, type ShopTag } from "@/lib/constants";
import { filterShopsByAllTags } from "@/lib/shop-categories";
import type { ShopFilterCategory } from "@/lib/shop-filter-categories";
import type { Shop } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  shops: Shop[];
  filterTags: readonly ShopTag[];
  filterCategories?: readonly ShopFilterCategory[];
  title: string;
  subtitle: string;
  emptyMessage: string;
  /** Open filters by default on desktop only; mobile always starts closed. */
  filterOpenByDefault?: boolean;
}

export function ShopsExplorer({
  shops,
  filterTags,
  filterCategories,
  title,
  subtitle,
  emptyMessage,
  filterOpenByDefault = false,
}: Props) {
  const [activeTags, setActiveTags] = useState<ShopTag[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!filterOpenByDefault) return;
    const mq = window.matchMedia("(min-width: 768px)");
    setFilterOpen(mq.matches);
  }, [filterOpenByDefault]);

  useEffect(() => {
    if (searchOpen) mobileSearchRef.current?.focus();
  }, [searchOpen]);

  const categories = useMemo(
    () =>
      filterCategories ??
      [{ label: "Type", tags: filterTags }] satisfies ShopFilterCategory[],
    [filterCategories, filterTags]
  );

  const filtered = useMemo(() => {
    let list = filterShopsByAllTags(shops, activeTags);
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
  }, [shops, activeTags, search]);

  const effectiveSelectedId =
    selectedId && filtered.some((s) => s.id === selectedId)
      ? selectedId
      : null;

  const selected =
    filtered.find((s) => s.id === effectiveSelectedId) ?? null;

  function openSearch() {
    setFilterOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearch("");
    setSearchOpen(false);
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
          className="kawaii-input py-2 text-sm"
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
                className={`w-full px-2 py-2 text-left transition ${
                  effectiveSelectedId === shop.id
                    ? "bg-sage/20 font-semibold text-sage-dark"
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

  const filterButton = (
    <button
      type="button"
      onClick={() => setFilterOpen((v) => !v)}
      aria-expanded={filterOpen}
      aria-label={filterOpen ? "Hide filters" : "Show filters"}
      className={`inline-flex w-1/2 items-center gap-2 px-1 py-1 text-sm font-semibold transition md:w-auto ${
        filterOpen ? "text-sage-dark" : "text-ink hover:text-sage-dark"
      }`}
    >
      <FilterIcon />
      <span>Filter</span>
      {activeTags.length > 0 && (
        <span className="bg-sage/20 px-2 py-0.5 text-xs font-semibold text-sage-dark">
          {activeTags.length}
        </span>
      )}
    </button>
  );

  const filterToggle = (
    <div className="flex w-full items-center">
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
            className="kawaii-input min-w-0 flex-1 py-2 text-sm"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="shrink-0 px-2 py-1 text-sm font-medium text-ink-muted hover:text-ink"
            aria-label="Close search"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          {filterButton}
          <button
            type="button"
            onClick={openSearch}
            className="ml-auto inline-flex items-center justify-center p-1.5 text-ink transition hover:text-sage-dark md:hidden"
            aria-label="Search shops"
          >
            <SearchIcon />
          </button>
        </>
      )}
    </div>
  );

  return (
    <ExplorerLayout
      title={title}
      subtitle={subtitle}
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
      detail={<ShopDetailPanel shop={selected} />}
    />
  );
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5 shrink-0"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
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
