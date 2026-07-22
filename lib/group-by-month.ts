import { MONTH_NAMES } from "./constants";
import type { Event } from "./types";
import { toZonedTime } from "date-fns-tz";

export interface MonthGroup {
  month: number;
  label: string;
  year: number;
  items: Event[];
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

function getEventYear(event: Event): number {
  const d = event.timezone
    ? toZonedTime(new Date(event.start_at), event.timezone)
    : new Date(event.start_at);
  return d.getFullYear();
}

export interface YearGroup {
  year: number;
  items: Event[];
}

export function groupEventsByYear(
  events: Event[],
  compare: (a: Event, b: Event) => number
): YearGroup[] {
  const buckets = new Map<number, Event[]>();

  for (const event of events) {
    const year = getEventYear(event);
    const list = buckets.get(year) ?? [];
    list.push(event);
    buckets.set(year, list);
  }

  return [...buckets.entries()]
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, items]) => ({
      year,
      items: [...items].sort(compare),
    }));
}

export function groupEventsByMonth(
  events: Event[],
  year: number
): MonthGroup[] {
  const buckets = new Map<number, Event[]>();
  for (let m = 0; m < 12; m++) buckets.set(m, []);

  for (const event of events) {
    const d = event.timezone
      ? toZonedTime(new Date(event.start_at), event.timezone)
      : new Date(event.start_at);
    if (d.getFullYear() !== year) continue;
    const list = buckets.get(d.getMonth()) ?? [];
    list.push(event);
    buckets.set(d.getMonth(), list);
  }

  return MONTH_NAMES.map((name, month) => ({
    month,
    label: `${name} ${year}`,
    year,
    items: (buckets.get(month) ?? []).sort(
      (a, b) =>
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    ),
  }));
}
