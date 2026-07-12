"use client";

import { MapPin } from "@/components/maps/MapPin";
import { MapShell } from "@/components/maps/MapShell";
import type { Event } from "@/lib/types";
import { useMemo } from "react";

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

  const fitPoints = useMemo(
    () => events.map((event) => ({ lat: event.lat, lng: event.lng })),
    [events]
  );

  const orderedEvents = useMemo(() => {
    if (!selectedId) return events;
    const selectedEvent = events.find((e) => e.id === selectedId);
    if (!selectedEvent) return events;
    return [...events.filter((e) => e.id !== selectedId), selectedEvent];
  }, [events, selectedId]);

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
      {orderedEvents.map((event) => (
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
