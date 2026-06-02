"use client";

import { EventDetailPanel } from "@/components/explorer/EventDetailPanel";
import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { DynamicEventMap } from "@/components/maps/DynamicEventMap";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { getCurrentYear, groupEventsByMonth } from "@/lib/group-by-month";
import type { Event } from "@/lib/types";
import { useMemo, useState } from "react";

export function EventsExplorer({ events }: { events: Event[] }) {
  const year = getCurrentYear();
  const months = useMemo(() => groupEventsByMonth(events, year), [events, year]);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(
    () => new Set([new Date().getMonth()])
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    events[0]?.id ?? null
  );

  const effectiveSelectedId =
    selectedId && events.some((e) => e.id === selectedId)
      ? selectedId
      : events[0]?.id ?? null;

  const selected =
    events.find((e) => e.id === effectiveSelectedId) ?? null;

  function toggleMonth(month: number) {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }

  const sidebar = (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {year}
      </p>
      <ul className="space-y-1">
        {months.map(({ month, label, items }) => {
          const open = expandedMonths.has(month);
          return (
            <li key={month}>
              <button
                type="button"
                onClick={() => toggleMonth(month)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-display font-semibold text-ink transition hover:bg-peach/40"
                aria-expanded={open}
              >
                <span>{label.split(" ")[0]}</span>
                <span className="text-sm text-ink-muted">
                  {open ? "−" : "+"} {items.length}
                </span>
              </button>
              {open && (
                <ul className="mb-2 ml-1 space-y-0.5 border-l-2 border-peach-dark/30 pl-2">
                  {items.length === 0 ? (
                    <li className="px-2 py-1 text-xs text-ink-muted">
                      No events
                    </li>
                  ) : (
                    items.map((event) => (
                      <li key={event.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(event.id)}
                          className={`w-full rounded-lg px-2 py-2 text-left text-sm transition ${
                            effectiveSelectedId === event.id
                              ? "bg-coral/20 font-semibold text-coral"
                              : "text-ink hover:bg-white/80"
                          }`}
                        >
                          {event.title}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <ExplorerLayout
      title="Events"
      subtitle="Browse by month — select an event to zoom the map"
      headerExtra={
        <KawaiiButton href="/submit/event" variant="secondary">
          Submit event
        </KawaiiButton>
      }
      sidebar={sidebar}
      map={
        <DynamicEventMap
          events={events}
          selectedId={effectiveSelectedId}
          onSelect={setSelectedId}
        />
      }
      detail={<EventDetailPanel event={selected} />}
    />
  );
}
