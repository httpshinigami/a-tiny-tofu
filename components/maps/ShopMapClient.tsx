"use client";

import { MapPin } from "@/components/maps/MapPin";
import { MapShell } from "@/components/maps/MapShell";
import type { Shop } from "@/lib/types";
import { useMemo } from "react";

export function ShopMapClient({
  shops,
  selectedId,
  onSelect,
}: {
  shops: Shop[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
}) {
  const selected = selectedId
    ? shops.find((s) => s.id === selectedId)
    : undefined;

  const fitPoints = useMemo(
    () => shops.map((shop) => ({ lat: shop.lat, lng: shop.lng })),
    [shops]
  );

  return (
    <MapShell
      className="h-full min-h-[280px] w-full"
      center={
        selected
          ? { lat: selected.lat, lng: selected.lng }
          : undefined
      }
      zoom={selected ? 15 : 12}
      focusKey={selected?.id ?? null}
      fitPoints={selected ? undefined : fitPoints}
    >
      {shops.map((shop) => (
        <MapPin
          key={shop.id}
          longitude={shop.lng}
          latitude={shop.lat}
          selected={selectedId === shop.id}
          tone="shop"
          onClick={() => onSelect?.(shop.id)}
        />
      ))}
    </MapShell>
  );
}
