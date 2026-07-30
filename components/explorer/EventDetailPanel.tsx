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

function formatSingleDate(iso: string, timeZone?: string | null): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...tzOpts(timeZone),
  });
}

function formatSessionLine(
  startIso: string,
  endIso: string | null,
  timeZone?: string | null
): string {
  const date = formatSingleDate(startIso, timeZone);
  if (!endIso) return `${date} — ${formatTime(startIso, timeZone)}`;
  return `${date} — ${formatTime(startIso, timeZone)} – ${formatTime(
    endIso,
    timeZone
  )}`;
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
      <p className="text-center text-sm text-ink-muted">
        Pick an event from the list to see details and zoom the map.
      </p>
    );
  }

  const scheduleLines = event.sessions.length
    ? event.sessions.map((session) =>
        formatSessionLine(session.start_at, session.end_at, event.timezone)
      )
    : [formatSessionLine(event.start_at, event.end_at, event.timezone)];

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold leading-snug text-ink">
          {event.title}
        </h2>
        <div className="mt-2 space-y-1">
          {scheduleLines.map((line, index) => (
            <p key={`${event.id}-session-${index}`} className="text-sm text-pink-dark">
              {line}
            </p>
          ))}
        </div>
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
        {event.instagram_url && (
          <div className="md:hidden">
            <MetaBlock label="Instagram">
              <SafeExternalLink
                href={event.instagram_url}
                className="font-medium text-sage-dark underline decoration-sage/40 underline-offset-2 hover:text-sage"
              >
                Visit on Instagram
              </SafeExternalLink>
            </MetaBlock>
          </div>
        )}
      </div>
    </div>
  );
}
