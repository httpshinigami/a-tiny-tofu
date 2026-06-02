"use client";

import { Marker } from "react-leaflet";
import { MapShell } from "@/components/maps/MapShell";
import { EVENT_MARKER, SELECTED_EVENT_MARKER } from "@/components/maps/markers";
import type { Event } from "@/lib/types";
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

export function EventMapClient({
  events,
  selectedId,
  onSelect,
}: {
  events: Event[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
}) {
  const selected = selectedId
    ? events.find((e) => e.id === selectedId)
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
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.lat, event.lng]}
          icon={
            selectedId === event.id ? SELECTED_EVENT_MARKER : EVENT_MARKER
          }
          eventHandlers={{
            click: () => onSelect?.(event.id),
          }}
        />
      ))}
    </MapShell>
  );
}
