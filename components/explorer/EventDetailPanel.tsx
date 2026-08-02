import { formatDisplayAddress } from "@/lib/format-address";
import { SafeExternalLink } from "@/components/ui/SafeExternalLink";
import type { Event } from "@/lib/types";
import type { ReactNode } from "react";

function tzOpts(timeZone?: string | null): Intl.DateTimeFormatOptions {
  return timeZone ? { timeZone } : {};
}

function formatTime(iso: string, timeZone?: string | null): string {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    ...tzOpts(timeZone),
  });
}

function formatSessionDate(iso: string, timeZone?: string | null): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...tzOpts(timeZone),
  });
}

function formatSessionTimes(
  startIso: string,
  endIso: string | null,
  timeZone?: string | null
): string {
  const start = formatTime(startIso, timeZone);
  if (!endIso) return start;
  return `${start} to ${formatTime(endIso, timeZone)}`;
}

function MetaBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted/70">
        {label}
      </p>
      <div className="mt-1 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}

export function EventDetailPanel({ event }: { event: Event | null }) {
  if (!event) {
    return (
      <p className="max-w-[16rem] text-center text-sm leading-relaxed text-ink-muted">
        Pick an event from the list to see details and zoom the map.
      </p>
    );
  }

  const scheduleRows = event.sessions.length
    ? event.sessions.map((session) => ({
        date: formatSessionDate(session.start_at, event.timezone),
        times: formatSessionTimes(
          session.start_at,
          session.end_at,
          event.timezone
        ),
      }))
    : [
        {
          date: formatSessionDate(event.start_at, event.timezone),
          times: formatSessionTimes(
            event.start_at,
            event.end_at,
            event.timezone
          ),
        },
      ];

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold leading-snug text-ink">
          {event.title}
        </h2>
        <ul className="mt-2 space-y-1.5">
          {scheduleRows.map((row, index) => (
            <li
              key={`${event.id}-session-${index}`}
              className="flex items-baseline justify-between gap-3 text-sm text-pink-dark"
            >
              <span className="min-w-0 font-medium">{row.date}</span>
              <span className="shrink-0 tabular-nums">{row.times}</span>
            </li>
          ))}
        </ul>
        {event.venue_name && (
          <p className="mt-1 text-sm text-ink-muted">{event.venue_name}</p>
        )}
      </header>

      {event.description && (
        <p className="text-sm leading-relaxed text-ink-muted">
          {event.description}
        </p>
      )}

      <div className="space-y-4 border-t border-border pt-4">
        <MetaBlock label="Address">
          {formatDisplayAddress(event.address)}
        </MetaBlock>
        {event.external_url && (
          <MetaBlock label="Organiser link">
            <SafeExternalLink
              href={event.external_url}
              className="font-medium text-sage-dark underline decoration-sage/40 underline-offset-2 hover:text-sage"
            >
              Open link
            </SafeExternalLink>
          </MetaBlock>
        )}
        {event.tickets_url && (
          <MetaBlock label="Tickets">
            <SafeExternalLink
              href={event.tickets_url}
              className="font-medium text-sage-dark underline decoration-sage/40 underline-offset-2 hover:text-sage"
            >
              Get tickets
            </SafeExternalLink>
          </MetaBlock>
        )}
      </div>
    </div>
  );
}
