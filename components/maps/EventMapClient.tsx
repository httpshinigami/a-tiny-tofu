"use client";

import { MapPin } from "@/components/maps/MapPin";
import { MapShell } from "@/components/maps/MapShell";
import { MELBOURNE_CENTER } from "@/lib/constants";
import type { Event } from "@/lib/types";

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
      center={
        selected
          ? { lat: selected.lat, lng: selected.lng }
          : MELBOURNE_CENTER
      }
      zoom={selected ? 15 : 12}
      focusKey={selected?.id ?? null}
    >
      {events.map((event) => (
        <MapPin
          key={event.id}
          longitude={event.lng}
          latitude={event.lat}
          selected={selectedId === event.id}
          tone="event"
          onClick={() => onSelect?.(event.id)}
        />
      ))}
    </MapShell>
  );
}
