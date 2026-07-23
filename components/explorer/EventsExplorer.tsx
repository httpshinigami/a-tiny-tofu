"use client";

import { EventDetailPanel } from "@/components/explorer/EventDetailPanel";
import { ExplorerLayout } from "@/components/explorer/ExplorerLayout";
import { InstagramEmbed } from "@/components/events/InstagramEmbed";
import { DynamicEventMap } from "@/components/maps/DynamicEventMap";
import {
  getCurrentYear,
  getEventMonth,
  getEventYear,
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
  year,
  months,
  expandedMonths,
  onToggleMonth,
  selectedId,
  onSelectEvent,
  emptyLabel = "No events",
}: {
  year: number;
  months: MonthGroup[];
  expandedMonths: Set<string>;
  onToggleMonth: (year: number, month: number) => void;
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
        const open = expandedMonths.has(monthKey(year, month));
        return (
          <li key={month}>
            <button
              type="button"
              onClick={() => onToggleMonth(year, month)}
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

function monthKey(year: number, month: number): string {
  return `${year}-${month}`;
}

function visibleMonthGroups(
  events: Event[],
  year: number,
  currentYear: number,
  currentMonth: number
): MonthGroup[] {
  return groupEventsByMonth(events, year).filter((group) => {
    if (group.items.length === 0) return false;
    if (year > currentYear) return true;
    if (year === currentYear) return group.month >= currentMonth;
    return false;
  });
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
  const currentYear = getCurrentYear();
  const currentMonth = new Date().getMonth();
  const [search, setSearch] = useState("");
  const [expandedYears, setExpandedYears] = useState<Set<number> | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<Set<string> | null>(
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

  const yearSections = useMemo(() => {
    const years = [...new Set(filteredEvents.map(getEventYear))].sort(
      (a, b) => a - b
    );
    return years
      .map((year) => ({
        year,
        months: visibleMonthGroups(
          filteredEvents,
          year,
          currentYear,
          currentMonth
        ),
      }))
      .filter((section) => section.months.length > 0);
  }, [filteredEvents, currentYear, currentMonth]);

  const defaultExpandedYears = useMemo(
    () => new Set([currentYear]),
    [currentYear]
  );

  const defaultExpandedMonths = useMemo(
    () =>
      new Set(
        yearSections.flatMap(({ year, months }) =>
          months.map((m) => monthKey(year, m.month))
        )
      ),
    [yearSections]
  );

  useEffect(() => {
    if (!initialFocusId) return;
    if (!events.some((e) => e.id === initialFocusId)) return;
    setSelectedId(initialFocusId);
    const focused = events.find((e) => e.id === initialFocusId);
    if (!focused) return;
    const year = getEventYear(focused);
    const month = getEventMonth(focused);
    setExpandedYears((prev) => {
      const next = new Set(prev ?? defaultExpandedYears);
      next.add(year);
      return next;
    });
    setExpandedMonths((prev) => {
      const next = new Set(prev ?? defaultExpandedMonths);
      next.add(monthKey(year, month));
      return next;
    });
  }, [initialFocusId, events, defaultExpandedYears, defaultExpandedMonths]);

  const visibleExpandedYears = useMemo(() => {
    if (search.trim()) return new Set(yearSections.map((section) => section.year));
    return expandedYears ?? defaultExpandedYears;
  }, [search, yearSections, expandedYears, defaultExpandedYears]);

  const visibleExpandedMonths = useMemo(() => {
    if (search.trim()) {
      return new Set(
        yearSections.flatMap(({ year, months }) =>
          months.map((m) => monthKey(year, m.month))
        )
      );
    }
    return expandedMonths ?? defaultExpandedMonths;
  }, [search, yearSections, expandedMonths, defaultExpandedMonths]);

  const effectiveSelectedId =
    selectedId && filteredEvents.some((e) => e.id === selectedId)
      ? selectedId
      : null;

  const selected =
    filteredEvents.find((e) => e.id === effectiveSelectedId) ?? null;

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const base = prev ?? defaultExpandedYears;
      const next = new Set(base);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  function toggleMonth(year: number, month: number) {
    setExpandedMonths((prev) => {
      const base = prev ?? defaultExpandedMonths;
      const key = monthKey(year, month);
      const next = new Set(base);
      if (next.has(key)) next.delete(key);
      else next.add(key);
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
        {yearSections.length === 0 ? (
          <p className="px-1 py-2 text-sm text-ink-muted">
            {search.trim() ? "No matching events" : "No upcoming events"}
          </p>
        ) : (
          yearSections.map(({ year, months }) => {
            const yearOpen = visibleExpandedYears.has(year);
            return (
              <div key={year} className="mb-4 last:mb-0">
                <button
                  type="button"
                  onClick={() => toggleYear(year)}
                  className="mb-3 flex w-full items-center gap-2 rounded-md py-0.5 text-left transition hover:opacity-80"
                  aria-expanded={yearOpen}
                >
                  <Chevron open={yearOpen} />
                  <span className="text-sm font-semibold text-ink">{year}</span>
                </button>
                {yearOpen && (
                  <MonthList
                    year={year}
                    months={months}
                    expandedMonths={visibleExpandedMonths}
                    onToggleMonth={toggleMonth}
                    selectedId={effectiveSelectedId}
                    onSelectEvent={setSelectedId}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <ExplorerLayout
      title="Markets & Events"
      subtitle="Browse by month — select an event to zoom the map"
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
          <div className="flex h-full min-h-0 flex-col md:-translate-x-0.2">
            <div className="min-h-[560px] flex-1 overflow-y-auto overscroll-contain">
              <InstagramEmbed url={selected.instagram_url} />
            </div>
          </div>
        ) : undefined
      }
    />
  );
}
