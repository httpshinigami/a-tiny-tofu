import { formatDisplayAddress } from "@/lib/format-address";
import type { Event } from "@/lib/types";
import type { ReactNode } from "react";

const TIME_OPTS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
};

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-AU", TIME_OPTS);
}

function formatSingleDate(d: Date): string {
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Compact range for multi-day events, e.g. "14–15 Jun 2026" or "28 Jun – 2 Jul 2026". */
function formatDateRange(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-AU", {
      month: "short",
      year: "numeric",
    })}`;
  }

  if (sameYear) {
    const startPart = start.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
    const endPart = end.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${startPart} – ${endPart}`;
  }

  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return `${start.toLocaleDateString("en-AU", opts)} – ${end.toLocaleDateString("en-AU", opts)}`;
}

function getScheduleLines(
  start: string,
  end: string | null
): { date: string; time: string | null } {
  const startDate = new Date(start);

  if (!end) {
    return { date: formatSingleDate(startDate), time: formatTime(startDate) };
  }

  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    return {
      date: formatSingleDate(startDate),
      time: `${formatTime(startDate)} – ${formatTime(endDate)}`,
    };
  }

  return {
    date: formatDateRange(startDate, endDate),
    time: `${formatTime(startDate)} – ${formatTime(endDate)}`,
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

  const { date, time } = getScheduleLines(event.start_at, event.end_at);

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold leading-snug text-ink">
          {event.title}
        </h2>
        <p className="mt-2 text-sm text-coral">{date}</p>
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
          <MetaBlock label="Website">
            <a
              href={event.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sage-dark underline decoration-sage/40 underline-offset-2 hover:text-sage"
            >
              Visit website
            </a>
          </MetaBlock>
        )}
      </div>
    </div>
  );
}
