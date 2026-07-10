"use client";

import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { ShopDetailPanel } from "@/components/explorer/ShopDetailPanel";
import { ShopFilterPanel } from "@/components/explorer/ShopFilterPanel";
import { DynamicShopMap } from "@/components/maps/DynamicShopMap";
import { SHOP_TAG_LABELS, type ShopTag } from "@/lib/constants";
import { filterShopsByAllTags } from "@/lib/shop-categories";
import type { ShopFilterCategory } from "@/lib/shop-filter-categories";
import type { Shop } from "@/lib/types";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { useMemo, useState } from "react";

interface Props {
  shops: Shop[];
  filterTags: readonly ShopTag[];
  filterCategories?: readonly ShopFilterCategory[];
  title: string;
  subtitle: string;
  emptyMessage: string;
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
  const [filterOpen, setFilterOpen] = useState(filterOpenByDefault);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const sidebar = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border p-3">
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
                className={`w-full rounded-xl px-3 py-2 text-left transition ${
                  effectiveSelectedId === shop.id
                    ? "bg-sage/20 font-semibold text-sage-dark"
                    : "text-ink hover:bg-cream"
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

  const filterToggle = (
    <button
      type="button"
      onClick={() => setFilterOpen((v) => !v)}
      aria-expanded={filterOpen}
      aria-label={filterOpen ? "Hide filters" : "Show filters"}
      className={`inline-flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-sm font-semibold transition ${
        filterOpen
          ? "border-sage bg-sage/10 text-sage-dark"
          : "border-border bg-cream text-ink shadow-sm hover:border-sage/50 hover:text-sage-dark"
      }`}
    >
      <FilterIcon />
      <span>Filter</span>
      {activeTags.length > 0 && (
        <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs font-semibold text-sage-dark">
          {activeTags.length}
        </span>
      )}
    </button>
  );

  return (
    <ExplorerLayout
      title={title}
      subtitle={subtitle}
      headerExtra={
        <KawaiiButton href="/submit" variant="sage">
          Submit a spot
        </KawaiiButton>
      }
      filterToggle={filterToggle}
      filterPanel={
        filterOpen ? (
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
