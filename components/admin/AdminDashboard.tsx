"use client";

import { AdminEventRow, AdminShopRow } from "@/components/admin/AdminListRows";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { SHOP_TAG_LABELS } from "@/lib/constants";
import type { Event, Shop } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  function refresh() {
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
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === t
                  ? "bg-sage text-white"
                  : "border border-border bg-surface text-ink"
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
            <h2 className="text-xl font-bold text-periwinkle">Pending events</h2>
            {pendingEvents.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">None waiting</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pendingEvents.map((e) => (
                  <AdminEventRow key={e.id} event={e} onDone={refresh} />
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-xl font-bold text-periwinkle">Pending shops</h2>
            {pendingShops.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">None waiting</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pendingShops.map((s) => (
                  <AdminShopRow
                    key={s.id}
                    shop={s}
                    tagLabels={s.shop_tags.map((t) => SHOP_TAG_LABELS[t]).join(", ")}
                    onDone={refresh}
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {tab === "events" && (
        <ul className="space-y-2">
          {allEvents.map((e) => (
            <AdminEventRow key={e.id} event={e} onDone={refresh} />
          ))}
        </ul>
      )}

      {tab === "shops" && (
        <ul className="space-y-2">
          {allShops.map((s) => (
            <AdminShopRow
              key={s.id}
              shop={s}
              tagLabels={s.shop_tags.map((t) => SHOP_TAG_LABELS[t]).join(", ")}
              onDone={refresh}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
