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

function sameCalendarDay(
  a: string,
  b: string,
  timeZone?: string | null
): boolean {
  const opts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    ...tzOpts(timeZone),
  };
  const start = new Date(a).toLocaleDateString("en-AU", opts);
  const end = new Date(b).toLocaleDateString("en-AU", opts);
  return start === end;
}

/** Compact range for multi-day events, e.g. "14–15 Jun 2026" or "28 Jun – 2 Jul 2026". */
function formatDateRange(
  startIso: string,
  endIso: string,
  timeZone?: string | null
): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const opts = tzOpts(timeZone);

  const startYear = start.toLocaleDateString("en-AU", { year: "numeric", ...opts });
  const endYear = end.toLocaleDateString("en-AU", { year: "numeric", ...opts });
  const startMonth = start.toLocaleDateString("en-AU", { month: "numeric", ...opts });
  const endMonth = end.toLocaleDateString("en-AU", { month: "numeric", ...opts });

  if (startYear === endYear && startMonth === endMonth) {
    const startDay = start.toLocaleDateString("en-AU", { day: "numeric", ...opts });
    const endDay = end.toLocaleDateString("en-AU", { day: "numeric", ...opts });
    const monthYear = start.toLocaleDateString("en-AU", {
      month: "short",
      year: "numeric",
      ...opts,
    });
    return `${startDay}–${endDay} ${monthYear}`;
  }

  if (startYear === endYear) {
    const startPart = start.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      ...opts,
    });
    const endPart = end.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      ...opts,
    });
    return `${startPart} – ${endPart}`;
  }

  const fullOpts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  };
  return `${start.toLocaleDateString("en-AU", fullOpts)} – ${end.toLocaleDateString("en-AU", fullOpts)}`;
}

function getScheduleLines(
  start: string,
  end: string | null,
  timeZone?: string | null
): { date: string; time: string | null } {
  if (!end) {
    return {
      date: formatSingleDate(start, timeZone),
      time: formatTime(start, timeZone),
    };
  }

  if (sameCalendarDay(start, end, timeZone)) {
    return {
      date: formatSingleDate(start, timeZone),
      time: `${formatTime(start, timeZone)} – ${formatTime(end, timeZone)}`,
    };
  }

  return {
    date: formatDateRange(start, end, timeZone),
    time: `${formatTime(start, timeZone)} – ${formatTime(end, timeZone)}`,
  };
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

  const { date, time } = getScheduleLines(
    event.start_at,
    event.end_at,
    event.timezone
  );

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold leading-snug text-ink">
          {event.title}
        </h2>
        <p className="mt-2 text-sm text-pink-dark">{date}</p>
        {time && <p className="mt-0.5 text-sm text-ink-muted">{time}</p>}
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
