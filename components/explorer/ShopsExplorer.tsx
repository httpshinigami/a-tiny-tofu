"use client";

import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { ShopDetailPanel } from "@/components/explorer/ShopDetailPanel";
import { DynamicShopMap } from "@/components/maps/DynamicShopMap";
import {
  SHOP_TAGS,
  SHOP_TAG_LABELS,
  TAG_COLORS,
  type ShopTag,
} from "@/lib/constants";
import type { Shop } from "@/lib/types";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { useMemo, useState } from "react";

export function ShopsExplorer({ shops }: { shops: Shop[] }) {
  const [activeTags, setActiveTags] = useState<ShopTag[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    shops[0]?.id ?? null
  );

  const filtered = useMemo(() => {
    if (!activeTags.length) return shops;
    return shops.filter((s) =>
      activeTags.every((t) => s.shop_tags.includes(t))
    );
  }, [shops, activeTags]);

  const effectiveSelectedId =
    selectedId && filtered.some((s) => s.id === selectedId)
      ? selectedId
      : filtered[0]?.id ?? null;

  const selected =
    filtered.find((s) => s.id === effectiveSelectedId) ?? null;

  function toggleTag(tag: ShopTag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const sidebar = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-peach-dark/20 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Filters
        </p>
        <div className="flex flex-wrap gap-2">
          {SHOP_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-2 transition ${
                activeTags.includes(tag)
                  ? "ring-coral"
                  : "ring-transparent hover:ring-peach-dark"
              }`}
              style={{ backgroundColor: TAG_COLORS[tag] }}
            >
              {SHOP_TAG_LABELS[tag]}
            </button>
          ))}
        </div>
        {activeTags.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTags([])}
            className="mt-2 text-xs text-coral underline"
          >
            Clear filters
          </button>
        )}
      </div>
      <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <li className="text-sm text-ink-muted">No shops match</li>
        ) : (
          filtered.map((shop) => (
            <li key={shop.id}>
              <button
                type="button"
                onClick={() => setSelectedId(shop.id)}
                className={`w-full rounded-xl px-3 py-2 text-left transition ${
                  effectiveSelectedId === shop.id
                    ? "bg-coral/20 font-semibold text-coral"
                    : "text-ink hover:bg-peach/30"
                }`}
              >
                <span className="font-display">{shop.name}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  return (
    <ExplorerLayout
      title="Shops"
      subtitle="Filter by what they offer — select a shop to zoom the map"
      headerExtra={
        <KawaiiButton href="/submit/shop" variant="secondary">
          Submit shop
        </KawaiiButton>
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
