import { KawaiiButton } from "@/components/ui/KawaiiButton";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/utils";

export function EventDetailPanel({ event }: { event: Event | null }) {
  if (!event) {
    return (
      <p className="text-center text-ink-muted">
        Pick an event from the list to see details and zoom the map.
      </p>
    );
  }

  return (
    <div>
      <time
        dateTime={event.start_at}
        className="text-sm font-semibold text-coral"
      >
        {formatEventDate(event.start_at, event.end_at)}
      </time>
      <h2 className="mt-1 font-display text-2xl font-bold text-ink">
        {event.title}
      </h2>
      <p className="mt-1 font-semibold text-ink-muted">{event.venue_name}</p>
      <p className="mt-3 text-ink-muted">{event.description}</p>
      <p className="mt-2 text-sm text-ink-muted">{event.address}</p>
      {event.external_url && (
        <div className="mt-4">
          <KawaiiButton href={event.external_url} variant="secondary">
            More info
          </KawaiiButton>
        </div>
      )}
    </div>
  );
}
