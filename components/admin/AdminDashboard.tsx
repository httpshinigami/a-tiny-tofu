"use client";

import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { SHOP_TAG_LABELS } from "@/lib/constants";
import type { Event, Shop } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function patchStatus(body: object) {
  const res = await fetch("/api/admin/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export function AdminDashboard({
  pendingEvents,
  pendingShops,
  allEvents,
  allShops,
  isAdmin,
}: {
  pendingEvents: Event[];
  pendingShops: Shop[];
  allEvents: Event[];
  allShops: Shop[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"queue" | "events" | "shops">("queue");

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (!isAdmin) {
    return (
      <p className="text-red-600">
        Your account is not on the admin allowlist. Check ADMIN_EMAILS in your
        environment.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(["queue", "events", "shops"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === t ? "bg-coral text-white" : "bg-white/70 text-ink"
              }`}
            >
              {t === "queue"
                ? `Queue (${pendingEvents.length + pendingShops.length})`
                : t === "events"
                  ? "All events"
                  : "All shops"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <KawaiiButton href="/admin/create/event" variant="secondary">
            New event
          </KawaiiButton>
          <KawaiiButton href="/admin/create/shop" variant="secondary">
            New shop
          </KawaiiButton>
          <KawaiiButton onClick={signOut} variant="ghost">
            Sign out
          </KawaiiButton>
        </div>
      </div>

      {tab === "queue" && (
        <>
          <section>
            <h2 className="font-display text-xl font-bold">Pending events</h2>
            {pendingEvents.length === 0 ? (
              <p className="text-sm text-ink-muted">None waiting</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {pendingEvents.map((e) => (
                  <PendingEventRow key={e.id} event={e} onDone={() => router.refresh()} />
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="font-display text-xl font-bold">Pending shops</h2>
            {pendingShops.length === 0 ? (
              <p className="text-sm text-ink-muted">None waiting</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {pendingShops.map((s) => (
                  <PendingShopRow key={s.id} shop={s} onDone={() => router.refresh()} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {tab === "events" && (
        <ul className="space-y-2 text-sm">
          {allEvents.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/60 px-4 py-2"
            >
              <span>
                {e.title}{" "}
                <span className="text-ink-muted">({e.status})</span>
              </span>
              <RowActions type="event" id={e.id} onDone={() => router.refresh()} />
            </li>
          ))}
        </ul>
      )}

      {tab === "shops" && (
        <ul className="space-y-2 text-sm">
          {allShops.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/60 px-4 py-2"
            >
              <span>
                {s.name}{" "}
                <span className="text-ink-muted">
                  ({s.status}) — {s.shop_tags.map((t) => SHOP_TAG_LABELS[t]).join(", ")}
                </span>
              </span>
              <RowActions type="shop" id={s.id} onDone={() => router.refresh()} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RowActions({
  type,
  id,
  onDone,
}: {
  type: "event" | "shop";
  id: string;
  onDone: () => void;
}) {
  return (
    <div className="flex gap-2">
      <ActionBtn label="Approve" onClick={() => patchStatus({ type, id, action: "approve" }).then(onDone)} />
      <ActionBtn label="Reject" onClick={() => patchStatus({ type, id, action: "reject" }).then(onDone)} />
      <ActionBtn label="Delete" onClick={() => patchStatus({ type, id, action: "delete" }).then(onDone)} danger />
    </div>
  );
}

function PendingEventRow({ event, onDone }: { event: Event; onDone: () => void }) {
  return (
    <li className="rounded-2xl border border-peach-dark/30 bg-white/80 p-4">
      <p className="font-display font-bold">{event.title}</p>
      <p className="text-sm text-ink-muted">{event.venue_name} · {event.address}</p>
      <p className="mt-1 text-sm">{event.description}</p>
      <div className="mt-3">
        <RowActions type="event" id={event.id} onDone={onDone} />
      </div>
    </li>
  );
}

function PendingShopRow({ shop, onDone }: { shop: Shop; onDone: () => void }) {
  return (
    <li className="rounded-2xl border border-peach-dark/30 bg-white/80 p-4">
      <p className="font-display font-bold">{shop.name}</p>
      <p className="text-sm text-ink-muted">{shop.address}</p>
      <p className="mt-1 text-sm">{shop.description}</p>
      <div className="mt-3">
        <RowActions type="shop" id={shop.id} onDone={onDone} />
      </div>
    </li>
  );
}

function ActionBtn({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        danger ? "bg-red-100 text-red-700" : "bg-coral/20 text-coral"
      }`}
    >
      {label}
    </button>
  );
}
