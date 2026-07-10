"use client";

import { EventDetailPanel } from "@/components/explorer/EventDetailPanel";
import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { DynamicEventMap } from "@/components/maps/DynamicEventMap";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import {
  getCurrentYear,
  groupEventsByMonth,
  type MonthGroup,
} from "@/lib/group-by-month";
import type { Event } from "@/lib/types";
import { useMemo, useState } from "react";

function MonthList({
  months,
  expandedMonths,
  onToggleMonth,
  selectedId,
  onSelectEvent,
  muted = false,
}: {
  months: MonthGroup[];
  expandedMonths: Set<number>;
  onToggleMonth: (month: number) => void;
  selectedId: string | null;
  onSelectEvent: (id: string) => void;
  muted?: boolean;
}) {
  const monthText = muted ? "text-ink-muted" : "text-ink";
  const countText = muted ? "text-ink-muted/70" : "text-ink-muted";
  const hoverBg = muted ? "hover:bg-peach/20" : "hover:bg-peach/40";
  const borderAccent = muted
    ? "border-ink-muted/25"
    : "border-peach-dark/30";

  return (
    <ul className="space-y-1">
      {months.map(({ month, label, items }) => {
        const open = expandedMonths.has(month);
        return (
          <li key={month}>
            <button
              type="button"
              onClick={() => onToggleMonth(month)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-display font-semibold transition ${monthText} ${hoverBg}`}
              aria-expanded={open}
            >
              <span>{label.split(" ")[0]}</span>
              <span className={`text-sm ${countText}`}>{items.length}</span>
            </button>
            {open && (
              <ul
                className={`mb-2 ml-1 space-y-0.5 border-l-2 pl-2 ${borderAccent}`}
              >
                {items.length === 0 ? (
                  <li className="px-2 py-1 text-xs text-ink-muted">
                    No events
                  </li>
                ) : (
                  items.map((event) => (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => onSelectEvent(event.id)}
                        className={`w-full rounded-lg px-2 py-2 text-left text-sm transition ${
                          selectedId === event.id
                            ? muted
                              ? "bg-ink-muted/15 font-semibold text-ink-muted"
                              : "bg-coral/20 font-semibold text-coral"
                            : muted
                              ? "text-ink-muted/80 hover:bg-white/50"
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
  );
}

export function EventsExplorer({ events }: { events: Event[] }) {
  const year = getCurrentYear();
  const currentMonth = new Date().getMonth();
  const months = useMemo(() => groupEventsByMonth(events, year), [events, year]);
  const { currentMonths, pastMonths } = useMemo(() => {
    const current: MonthGroup[] = [];
    const past: MonthGroup[] = [];
    for (const group of months) {
      if (group.month < currentMonth) past.push(group);
      else current.push(group);
    }
    return { currentMonths: current, pastMonths: past };
  }, [months, currentMonth]);

  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(
    () => new Set([currentMonth])
  );
  const [showPastEvents, setShowPastEvents] = useState(false);
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
      <MonthList
        months={currentMonths}
        expandedMonths={expandedMonths}
        onToggleMonth={toggleMonth}
        selectedId={effectiveSelectedId}
        onSelectEvent={setSelectedId}
      />
      {pastMonths.length > 0 && (
        <div className="mt-3 border-t border-ink-muted/30 pt-3">
          <button
            type="button"
            onClick={() => setShowPastEvents((open) => !open)}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-ink-muted transition hover:bg-peach/20"
            aria-expanded={showPastEvents}
          >
            {showPastEvents ? "Hide past events" : "See past events"}
          </button>
          {showPastEvents && (
            <div className="mt-2">
              <MonthList
                months={pastMonths}
                expandedMonths={expandedMonths}
                onToggleMonth={toggleMonth}
                selectedId={effectiveSelectedId}
                onSelectEvent={setSelectedId}
                muted
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <ExplorerLayout
      title="Markets & Events"
      subtitle="Browse by month — select an event to zoom the map"
      headerExtra={
        <KawaiiButton href="/submit" variant="sage">
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
