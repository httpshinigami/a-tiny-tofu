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
  submitHref?: string;
  filterOpenByDefault?: boolean;
}

export function ShopsExplorer({
  shops,
  filterTags,
  filterCategories,
  title,
  subtitle,
  emptyMessage,
  submitHref = "/submit/shop",
  filterOpenByDefault = false,
}: Props) {
  const [activeTags, setActiveTags] = useState<ShopTag[]>([]);
  const [filterOpen, setFilterOpen] = useState(filterOpenByDefault);
  const [selectedId, setSelectedId] = useState<string | null>(
    shops[0]?.id ?? null
  );

  const categories = useMemo(
    () =>
      filterCategories ??
      [{ label: "Type", tags: filterTags }] satisfies ShopFilterCategory[],
    [filterCategories, filterTags]
  );

  const filtered = useMemo(
    () => filterShopsByAllTags(shops, activeTags),
    [shops, activeTags]
  );

  const effectiveSelectedId =
    selectedId && filtered.some((s) => s.id === selectedId)
      ? selectedId
      : filtered[0]?.id ?? null;

  const selected =
    filtered.find((s) => s.id === effectiveSelectedId) ?? null;

  const sidebar = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border p-3">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          aria-expanded={filterOpen}
          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            filterOpen
              ? "border-sage bg-sage/10 text-sage-dark"
              : "border-border bg-surface text-ink hover:border-sage/50 hover:text-sage-dark"
          }`}
        >
          <span>Filter</span>
          <span className="flex items-center gap-2 text-xs font-normal text-ink-muted">
            {activeTags.length > 0 && (
              <span className="rounded-full bg-sage/20 px-2 py-0.5 font-semibold text-sage-dark">
                {activeTags.length}
              </span>
            )}
            <Chevron open={filterOpen} />
          </span>
        </button>
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

  return (
    <ExplorerLayout
      title={title}
      subtitle={subtitle}
      headerExtra={
        <KawaiiButton href={submitHref} variant="sage">
          Submit a spot
        </KawaiiButton>
      }
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

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transition ${open ? "rotate-180" : ""}`}
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
