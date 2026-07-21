import { fromZonedTime } from "date-fns-tz";
import { find as findTimezone } from "geo-tz";
import { resolveCoords, type GeocodeResult } from "./geocode";

const NAIVE_LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export function getTimezoneFromCoords(lat: number, lng: number): string {
  const zones = findTimezone(lat, lng);
  return zones[0] ?? "UTC";
}

/** True when the value is a wall-clock datetime from DateTimePicker (no timezone). */
export function isNaiveLocalDateTime(value: string): boolean {
  return NAIVE_LOCAL_RE.test(value);
}

/** Convert a venue-local wall-clock time to UTC ISO for storage. */
export function localDateTimeToUtcIso(
  naiveLocal: string,
  timeZone: string
): string {
  if (!isNaiveLocalDateTime(naiveLocal)) {
    throw new Error(`Expected naive local datetime, got: ${naiveLocal}`);
  }
  const normalized = `${naiveLocal.replace("T", " ")}:00`;
  return fromZonedTime(normalized, timeZone).toISOString();
}

export interface ResolvedEventSchedule extends GeocodeResult {
  timezone: string;
  start_at: string;
  end_at: string | null;
}

export async function resolveEventSchedule(input: {
  address: string;
  mapLocation?: string;
  startAt: string;
  endAt?: string | null;
}): Promise<ResolvedEventSchedule> {
  const coords = await resolveCoords(input.address, input.mapLocation);
  const timezone = getTimezoneFromCoords(coords.lat, coords.lng);

  const start_at = isNaiveLocalDateTime(input.startAt)
    ? localDateTimeToUtcIso(input.startAt, timezone)
    : new Date(input.startAt).toISOString();

  let end_at: string | null = null;
  if (input.endAt) {
    end_at = isNaiveLocalDateTime(input.endAt)
      ? localDateTimeToUtcIso(input.endAt, timezone)
      : new Date(input.endAt).toISOString();
  }

  return {
    ...coords,
    timezone,
    start_at,
    end_at,
  };
}
