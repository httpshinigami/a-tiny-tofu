import { KawaiiButton } from "@/components/ui/KawaiiButton";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/utils";

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="border-y border-border py-5">
      <time
        dateTime={event.start_at}
        className="text-sm font-semibold text-coral"
      >
        {formatEventDate(event.start_at, event.end_at, event.timezone)}
      </time>
      <h2 className="mt-1 font-display text-xl font-bold text-ink md:text-2xl">
        {event.title}
      </h2>
      <p className="mt-1 text-sm font-semibold text-ink-muted">
        {event.venue_name}
      </p>
      <p className="mt-2 text-ink-muted">{event.description}</p>
      <p className="mt-2 text-xs text-ink-muted">{event.address}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <KawaiiButton href={`/events/map?focus=${event.id}`} variant="secondary">
          View on map
        </KawaiiButton>
        {event.external_url && (
          <KawaiiButton href={event.external_url} variant="ghost">
            More info
          </KawaiiButton>
        )}
      </div>
    </article>
  );
}
