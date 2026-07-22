"use client";

import { patchStatus } from "@/components/admin/admin-actions";
import type { Status } from "@/lib/constants";
import type { Event, Shop } from "@/lib/types";
import { formatEventDate } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    pending: "bg-butter/60 text-ink",
    approved: "bg-sage/20 text-sage-dark",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function QuickActions({
  type,
  id,
  onDone,
}: {
  type: "event" | "shop";
  id: string;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!confirm("Delete this listing permanently?")) return;
    setError("");
    setBusy(true);
    const result = await patchStatus({ type, id, action: "delete" });
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Request failed");
      return;
    }
    onDone();
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={busy}
        onClick={remove}
        className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
      >
        Delete
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function AdminEventRow({
  event,
  onDone,
}: {
  event: Event;
  onDone: () => void;
}) {
  return (
    <li className="flex h-full flex-col border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link
          href={`/admin/events/${event.id}`}
          className="font-display text-base font-semibold text-ink transition hover:text-sage-dark"
        >
          {event.title}
        </Link>
        <StatusBadge status={event.status} />
      </div>
      <p className="mt-2 text-sm font-medium text-ink-muted">{event.venue_name}</p>
      <p className="mt-1 text-xs text-ink-muted">
        {formatEventDate(event.start_at, event.end_at, event.timezone)}
      </p>
      <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{event.address}</p>
      {event.description && (
        <p className="mt-2 line-clamp-3 text-sm text-ink-muted">
          {event.description}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <Link
          href={`/admin/events/${event.id}`}
          className="text-xs font-semibold text-sage-dark hover:underline"
        >
          Edit
        </Link>
        <QuickActions type="event" id={event.id} onDone={onDone} />
      </div>
    </li>
  );
}

export function AdminShopRow({
  shop,
  tagLabels,
  editHref,
  onDone,
}: {
  shop: Shop;
  tagLabels: string;
  editHref?: string;
  onDone: () => void;
}) {
  const href = editHref ?? `/admin/shops/${shop.id}`;

  return (
    <li className="flex h-full flex-col border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link
          href={href}
          className="font-display text-base font-semibold text-ink transition hover:text-sage-dark"
        >
          {shop.name}
        </Link>
        <StatusBadge status={shop.status} />
      </div>
      {tagLabels && (
        <p className="mt-2 text-xs font-medium text-ink-muted">{tagLabels}</p>
      )}
      <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{shop.address}</p>
      {shop.description && (
        <p className="mt-2 line-clamp-3 text-sm text-ink-muted">
          {shop.description}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <Link
          href={href}
          className="text-xs font-semibold text-sage-dark hover:underline"
        >
          Edit
        </Link>
        <QuickActions type="shop" id={shop.id} onDone={onDone} />
      </div>
    </li>
  );
}
