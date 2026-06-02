"use client";

import dynamic from "next/dynamic";
import type { Event } from "@/lib/types";

const EventMapClient = dynamic(
  () =>
    import("@/components/maps/EventMapClient").then((m) => m.EventMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-3xl bg-peach/30">
        <p className="font-display text-ink-muted">Loading map…</p>
      </div>
    ),
  }
);

export function DynamicEventMap({
  events,
  selectedId,
  onSelect,
}: {
  events: Event[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <EventMapClient
      events={events}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
