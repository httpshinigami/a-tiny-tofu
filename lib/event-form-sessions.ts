import type { EventSessionInput } from "./types";

const SESSION_START_RE = /^sessions\.(\d+)\.start_at$/;
const SESSION_END_RE = /^sessions\.(\d+)\.end_at$/;

export function extractEventSessionsFromFormData(
  fd: FormData
): EventSessionInput[] {
  const map = new Map<number, EventSessionInput>();

  for (const [key, rawValue] of fd.entries()) {
    if (typeof rawValue !== "string") continue;

    const startMatch = key.match(SESSION_START_RE);
    if (startMatch) {
      const index = Number(startMatch[1]);
      const session = map.get(index) ?? { start_at: "", end_at: null };
      session.start_at = rawValue;
      map.set(index, session);
      continue;
    }

    const endMatch = key.match(SESSION_END_RE);
    if (endMatch) {
      const index = Number(endMatch[1]);
      const session = map.get(index) ?? { start_at: "", end_at: null };
      session.end_at = rawValue || null;
      map.set(index, session);
    }
  }

  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, session]) => ({
      start_at: session.start_at,
      end_at: session.end_at || null,
    }))
    .filter((session) => session.start_at);
}
