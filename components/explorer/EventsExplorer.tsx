"use client";

import { EventDetailPanel } from "@/components/explorer/EventDetailPanel";
import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { InstagramEmbed } from "@/components/events/InstagramEmbed";
import { DynamicEventMap } from "@/components/maps/DynamicEventMap";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import {
  getCurrentYear,
  groupEventsByMonth,
  type MonthGroup,
} from "@/lib/group-by-month";
import type { Event } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

function formatListDate(start: string, timeZone?: string | null): string {
  return new Date(start).toLocaleString("en-AU", {
    weekday: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  });
}

function MonthList({
  months,
  expandedMonths,
  onToggleMonth,
  selectedId,
  onSelectEvent,
  emptyLabel = "No events",
}: {
  months: MonthGroup[];
  expandedMonths: Set<number>;
  onToggleMonth: (month: number) => void;
  selectedId: string | null;
  onSelectEvent: (id: string) => void;
  emptyLabel?: string;
}) {
  if (months.length === 0) {
    return <p className="px-1 py-2 text-sm text-ink-muted">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-4">
      {months.map(({ month, label, items }) => {
        const open = expandedMonths.has(month);
        return (
          <li key={month}>
            <button
              type="button"
              onClick={() => onToggleMonth(month)}
              className="flex w-full items-center gap-2 rounded-md py-1 text-left transition hover:opacity-80"
              aria-expanded={open}
            >
              <Chevron open={open} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {label.split(" ")[0]}
              </span>
              <span className="h-px flex-1 bg-border" aria-hidden />
              <span className="text-[11px] tabular-nums text-ink-muted/70">
                {items.length}
              </span>
            </button>
            {open && (
              <ul className="mt-1.5 space-y-0.5">
                {items.map((event) => {
                  const selected = selectedId === event.id;
                  return (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => onSelectEvent(event.id)}
                        className={`w-full px-2 py-2.5 text-left transition ${
                          selected
                            ? "bg-coral/15"
                            : "hover:bg-surface/80"
                        }`}
                      >
                        <span
                          className={`block text-sm leading-snug ${
                            selected
                              ? "font-semibold text-coral"
                              : "font-medium text-ink"
                          }`}
                        >
                          {event.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-muted">
                          {formatListDate(event.start_at, event.timezone)}
                          {event.venue_name ? ` · ${event.venue_name}` : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 text-ink-muted/60 transition ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function filterEventsBySearch(events: Event[], query: string): Event[] {
  const q = query.trim().toLowerCase();
  if (!q) return events;
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(q) ||
      event.venue_name.toLowerCase().includes(q) ||
      event.address.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q)
  );
}

export function EventsExplorer({
  events,
  initialFocusId = null,
}: {
  events: Event[];
  initialFocusId?: string | null;
}) {
  const year = getCurrentYear();
  const currentMonth = new Date().getMonth();
  const [search, setSearch] = useState("");
  const [yearOpen, setYearOpen] = useState(true);
  const [expandedMonths, setExpandedMonths] = useState<Set<number> | null>(
    null
  );
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (!initialFocusId) return null;
    return events.some((e) => e.id === initialFocusId) ? initialFocusId : null;
  });

  const filteredEvents = useMemo(
    () => filterEventsBySearch(events, search),
    [events, search]
  );

  const months = useMemo(() => {
    const grouped = groupEventsByMonth(filteredEvents, year);
    return grouped.filter(
      (group) => group.month >= currentMonth && group.items.length > 0
    );
  }, [filteredEvents, year, currentMonth]);

  const defaultOpen = useMemo(
    () => new Set(months.map((m) => m.month)),
    [months]
  );

  useEffect(() => {
    if (!initialFocusId) return;
    if (!events.some((e) => e.id === initialFocusId)) return;
    setSelectedId(initialFocusId);
    setYearOpen(true);
    const focused = events.find((e) => e.id === initialFocusId);
    if (!focused) return;
    const month = new Date(focused.start_at).getMonth();
    setExpandedMonths((prev) => {
      const next = new Set(prev ?? defaultOpen);
      next.add(month);
      return next;
    });
  }, [initialFocusId, events, defaultOpen]);

  const visibleExpandedMonths = useMemo(() => {
    if (search.trim()) {
      return new Set(months.map((m) => m.month));
    }
    return expandedMonths ?? defaultOpen;
  }, [search, months, expandedMonths, defaultOpen]);

  const effectiveSelectedId =
    selectedId && filteredEvents.some((e) => e.id === selectedId)
      ? selectedId
      : null;

  const selected =
    filteredEvents.find((e) => e.id === effectiveSelectedId) ?? null;

  function toggleMonth(month: number) {
    setExpandedMonths((prev) => {
      const base = prev ?? defaultOpen;
      const next = new Set(base);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }

  const sidebar = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border p-3">
        <label htmlFor="event-search" className="sr-only">
          Search markets and events
        </label>
        <input
          id="event-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search markets & events…"
          className="kawaii-input py-2 text-sm"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
        <button
          type="button"
          onClick={() => setYearOpen((open) => !open)}
          className="mb-3 flex w-full items-center gap-2 rounded-md py-0.5 text-left transition hover:opacity-80"
          aria-expanded={yearOpen}
        >
          <Chevron open={yearOpen} />
          <span className="text-sm font-semibold text-ink">{year}</span>
        </button>
        {yearOpen && (
          <MonthList
            months={months}
            expandedMonths={visibleExpandedMonths}
            onToggleMonth={toggleMonth}
            selectedId={effectiveSelectedId}
            onSelectEvent={setSelectedId}
            emptyLabel={
              search.trim() ? "No matching events" : "No upcoming events"
            }
          />
        )}
      </div>
    </div>
  );

  return (
    <ExplorerLayout
      title="Markets & Events"
      subtitle="Browse by month — select an event to zoom the map"
      headerExtra={
        <KawaiiButton href="/submit" variant="primary">
          Submit event
        </KawaiiButton>
      }
      sidebar={sidebar}
      map={
        <DynamicEventMap
          events={filteredEvents}
          selectedId={effectiveSelectedId}
          onSelect={setSelectedId}
        />
      }
      detail={<EventDetailPanel event={selected} />}
      leftPanel={
        selected?.instagram_url ? (
          <div className="flex h-full min-h-0 flex-col">
            <p className="mb-2 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted/70">
              Instagram
            </p>
            <div className="min-h-[560px] flex-1 overflow-y-auto overscroll-contain">
              <InstagramEmbed url={selected.instagram_url} />
            </div>
          </div>
        ) : undefined
      }
    />
  );
}
