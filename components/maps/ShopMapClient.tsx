"use client";

import { Marker } from "react-leaflet";
import { MapShell } from "@/components/maps/MapShell";
import { SHOP_MARKER, SELECTED_SHOP_MARKER } from "@/components/maps/markers";
import type { Shop } from "@/lib/types";
import { MELBOURNE_CENTER } from "@/lib/constants";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapFocus({
  lat,
  lng,
  zoom,
}: {
  lat: number;
  lng: number;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 0.8 });
  }, [map, lat, lng, zoom]);
  return null;
}

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

  return (
    <MapShell
      className="h-full min-h-[280px] w-full"
      center={selected ? { lat: selected.lat, lng: selected.lng } : MELBOURNE_CENTER}
      zoom={selected ? 15 : 12}
    >
      {selected && (
        <MapFocus lat={selected.lat} lng={selected.lng} zoom={15} />
      )}
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.lat, shop.lng]}
          icon={
            selectedId === shop.id ? SELECTED_SHOP_MARKER : SHOP_MARKER
          }
          eventHandlers={{
            click: () => onSelect?.(shop.id),
          }}
        />
      ))}
    </MapShell>
  );
}
