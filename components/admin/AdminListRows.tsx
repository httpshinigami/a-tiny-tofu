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
    rejected: "bg-red-100 text-red-700",
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
  const [open, setOpen] = useState(false);

  return (
    <li className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex shrink-0 items-center justify-center rounded-lg p-1 text-ink-muted transition hover:bg-cream"
          aria-expanded={open}
          aria-label={open ? "Collapse details" : "Expand details"}
        >
          <Chevron open={open} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/events/${event.id}`}
              className="font-semibold text-ink transition hover:text-sage-dark"
            >
              {event.title}
            </Link>
            <StatusBadge status={event.status} />
          </div>
          <p className="truncate text-xs text-ink-muted">
            {event.venue_name} · {formatEventDate(event.start_at, event.end_at)}
          </p>
        </div>
        <Link
          href={`/admin/events/${event.id}`}
          className="shrink-0 text-xs font-semibold text-sage-dark hover:underline"
        >
          Edit
        </Link>
      </div>
      {open && (
        <div className="border-t border-border bg-cream/50 px-4 py-3 text-sm">
          <dl className="grid gap-2 sm:grid-cols-2">
            <Detail label="Venue" value={event.venue_name} />
            <Detail label="Address" value={event.address} />
            <Detail
              label="When"
              value={formatEventDate(event.start_at, event.end_at)}
            />
            {event.external_url && (
              <Detail label="Link" value={event.external_url} isLink />
            )}
          </dl>
          <p className="mt-3 text-ink-muted">{event.description}</p>
          <div className="mt-4">
            <QuickActions
              type="event"
              id={event.id}
              status={event.status}
              onDone={onDone}
            />
          </div>
        </div>
      )}
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
  const [open, setOpen] = useState(false);
  const href = editHref ?? `/admin/shops/${shop.id}`;

  return (
    <li className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex shrink-0 items-center justify-center rounded-lg p-1 text-ink-muted transition hover:bg-cream"
          aria-expanded={open}
          aria-label={open ? "Collapse details" : "Expand details"}
        >
          <Chevron open={open} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={href}
              className="font-semibold text-ink transition hover:text-sage-dark"
            >
              {shop.name}
            </Link>
            <StatusBadge status={shop.status} />
          </div>
          <p className="truncate text-xs text-ink-muted">
            {shop.address}
            {tagLabels ? ` · ${tagLabels}` : ""}
          </p>
        </div>
        <Link
          href={href}
          className="shrink-0 text-xs font-semibold text-sage-dark hover:underline"
        >
          Edit
        </Link>
      </div>
      {open && (
        <div className="border-t border-border bg-cream/50 px-4 py-3 text-sm">
          <dl className="grid gap-2 sm:grid-cols-2">
            <Detail label="Address" value={shop.address} />
            {shop.hours && <Detail label="Hours" value={shop.hours} />}
            {shop.website && (
              <Detail label="Website" value={shop.website} isLink />
            )}
            {tagLabels && <Detail label="Tags" value={tagLabels} />}
          </dl>
          <p className="mt-3 text-ink-muted">{shop.description}</p>
          <div className="mt-4">
            <QuickActions
              type="shop"
              id={shop.id}
              status={shop.status}
              tagCount={shop.shop_tags.length}
              onDone={onDone}
            />
          </div>
        </div>
      )}
    </li>
  );
}

function Detail({
  label,
  value,
  isLink,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sage-dark underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transition ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
