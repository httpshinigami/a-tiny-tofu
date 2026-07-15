"use client";

import { patchStatus, SHOP_TAG_REQUIRED_MESSAGE } from "@/components/admin/admin-actions";
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
  status,
  tagCount,
  onDone,
}: {
  type: "event" | "shop";
  id: string;
  status: Status;
  tagCount?: number;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action: "approve" | "delete") {
    if (action === "approve" && type === "shop" && !tagCount) {
      setError(SHOP_TAG_REQUIRED_MESSAGE);
      return;
    }
    if (action === "delete" && !confirm("Delete this listing permanently?")) {
      return;
    }
    setError("");
    setBusy(true);
    const result = await patchStatus({ type, id, action });
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Request failed");
      return;
    }
    onDone();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {status !== "approved" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => run("approve")}
            className="rounded-lg bg-sage/20 px-3 py-1.5 text-xs font-semibold text-sage-dark transition hover:bg-sage/30 disabled:opacity-50"
          >
            Approve
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => run("delete")}
          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
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
        {formatEventDate(event.start_at, event.end_at)}
      </p>
      <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{event.address}</p>
      {event.description && (
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-muted">
          {event.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <Link
          href={`/admin/events/${event.id}`}
          className="text-xs font-semibold text-sage-dark hover:underline"
        >
          Edit
        </Link>
        <QuickActions
          type="event"
          id={event.id}
          status={event.status}
          onDone={onDone}
        />
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
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-muted">
          {shop.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <Link
          href={href}
          className="text-xs font-semibold text-sage-dark hover:underline"
        >
          Edit
        </Link>
        <QuickActions
          type="shop"
          id={shop.id}
          status={shop.status}
          tagCount={shop.shop_tags.length}
          onDone={onDone}
        />
      </div>
    </li>
  );
}
