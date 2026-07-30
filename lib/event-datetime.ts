import { fromZonedTime } from "date-fns-tz";
import { find as findTimezone } from "geo-tz";
import { resolveCoords, type GeocodeResult } from "./geocode";
import type { EventSessionInput } from "./types";

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

export interface ResolvedEventSessions extends GeocodeResult {
  timezone: string;
  start_at: string;
  end_at: string | null;
  sessions: EventSessionInput[];
}

function normalizeSession(
  session: EventSessionInput,
  timezone: string
): EventSessionInput {
  const start_at = isNaiveLocalDateTime(session.start_at)
    ? localDateTimeToUtcIso(session.start_at, timezone)
    : new Date(session.start_at).toISOString();

  let end_at: string | null = null;
  if (!session.end_at) {
    throw new Error("Session end time is required");
  }
  end_at = isNaiveLocalDateTime(session.end_at)
    ? localDateTimeToUtcIso(session.end_at, timezone)
    : new Date(session.end_at).toISOString();

  if (new Date(end_at).getTime() <= new Date(start_at).getTime()) {
    throw new Error("Session end must be after start");
  }

  return { start_at, end_at };
}

export async function resolveEventSessions(input: {
  address: string;
  mapLocation?: string;
  sessions: EventSessionInput[];
}): Promise<ResolvedEventSessions> {
  if (input.sessions.length === 0) {
    throw new Error("At least one session is required");
  }

  const coords = await resolveCoords(input.address, input.mapLocation);
  const timezone = getTimezoneFromCoords(coords.lat, coords.lng);
  const sessions = input.sessions
    .map((session) => normalizeSession(session, timezone))
    .sort(
      (a, b) =>
        new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );

  const start_at = sessions[0].start_at;
  const end_at = sessions[sessions.length - 1].end_at;

  return {
    ...coords,
    timezone,
    start_at,
    end_at,
    sessions,
  };
}
