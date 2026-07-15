import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { formatDisplayAddress } from "@/lib/format-address";
import { formatEventDate } from "@/lib/utils";
import { SHOP_TAG_LABELS } from "@/lib/constants";
import type { Event, Shop } from "@/lib/types";

type PendingTile =
  | { kind: "event"; item: Event }
  | { kind: "shop"; item: Shop; category: "shop" | "food" };

interface Props {
  pendingEvents: Event[];
  pendingShops: Shop[];
  pendingFood: Shop[];
}

export function SubmitLanding({
  pendingEvents,
  pendingShops,
  pendingFood,
}: Props) {
  const tiles: PendingTile[] = [
    ...pendingEvents.map((item) => ({ kind: "event" as const, item })),
    ...pendingShops.map((item) => ({
      kind: "shop" as const,
      item,
      category: "shop" as const,
    })),
    ...pendingFood.map((item) => ({
      kind: "shop" as const,
      item,
      category: "food" as const,
    })),
  ].sort(
    (a, b) =>
      new Date(b.item.created_at).getTime() -
      new Date(a.item.created_at).getTime()
  );

  return (
    <>
      <div className="text-center">
        <p className="mx-auto max-w-2xl text-ink-muted">
          We review every submission before it goes live. Check the pending list
          below first so we don&apos;t get duplicates, then start your
          submission.
        </p>

        <div className="mt-8 flex justify-center">
          <KawaiiButton href="/submit/event" variant="primary">
            Start a submission
          </KawaiiButton>
        </div>
      </div>

      <section className="mt-12 border-t border-border pt-10">
        <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-butter text-ink">
            <PendingClockIcon className="size-5" />
          </span>
          Pending submissions
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          These are waiting for review. If you see your spot here, no need to
          submit it again.
        </p>

        {tiles.length === 0 ? (
          <p className="mt-6 border border-dashed border-border px-4 py-8 text-center text-sm text-ink-muted">
            Nothing pending right now. Feel free to submit something new.
          </p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {tiles.map((tile) => (
              <li key={`${tile.kind}-${tile.item.id}`}>
                <PendingCard tile={tile} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function PendingClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
    </svg>
  );
}

function PendingCard({ tile }: { tile: PendingTile }) {
  if (tile.kind === "event") {
    const event = tile.item;
    return (
      <article className="h-full border border-butter/80 bg-butter/25 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-coral">
            Market / Event
          </p>
          <span className="bg-butter px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
            Pending
          </span>
        </div>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{event.venue_name}</p>
        <p className="mt-2 text-xs text-ink-muted">
          {formatEventDate(event.start_at, event.end_at)}
        </p>
      </article>
    );
  }

  const shop = tile.item;
  const label = tile.category === "food" ? "Food & Drink" : "Shop";
  const accent =
    tile.category === "food" ? "text-peach-dark" : "text-sage-dark";

  return (
    <article className="h-full border border-butter/80 bg-butter/25 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className={`text-xs font-semibold uppercase tracking-wide ${accent}`}>
          {label}
        </p>
        <span className="bg-butter px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
          Pending
        </span>
      </div>
      <h3 className="mt-1 font-display text-lg font-semibold text-ink">
        {shop.name}
      </h3>
      {shop.shop_tags.length > 0 && (
        <p className="mt-1 text-xs text-ink-muted">
          {shop.shop_tags.map((t) => SHOP_TAG_LABELS[t]).join(", ")}
        </p>
      )}
      <p className="mt-2 text-xs text-ink-muted">
        {formatDisplayAddress(shop.address)}
      </p>
    </article>
  );
}
