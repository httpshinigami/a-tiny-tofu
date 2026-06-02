"use client";

import dynamic from "next/dynamic";
import type { Shop } from "@/lib/types";

const ShopMapClient = dynamic(
  () =>
    import("@/components/maps/ShopMapClient").then((m) => m.ShopMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-3xl bg-peach/30">
        <p className="font-display text-ink-muted">Loading map…</p>
      </div>
    ),
  }
);

export function DynamicShopMap({
  shops,
  selectedId,
  onSelect,
}: {
  shops: Shop[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <ShopMapClient
      shops={shops}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
