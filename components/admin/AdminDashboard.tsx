"use client";

import { AdminEventRow, AdminShopRow } from "@/components/admin/AdminListRows";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { FOOD_DRINK_TAGS, RETAIL_SHOP_TAGS, SHOP_TAG_LABELS } from "@/lib/constants";
import { filterShopsByTags } from "@/lib/shop-categories";
import type { Event, Shop } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Tab = "queue" | "events" | "shops" | "food";

const TABS: { id: Tab; label: string }[] = [
  { id: "queue", label: "Queue" },
  { id: "events", label: "All events" },
  { id: "shops", label: "All shops" },
  { id: "food", label: "All food & drink" },
];

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
  const [tab, setTab] = useState<Tab>("queue");

  const pendingRetailShops = useMemo(
    () => filterShopsByTags(pendingShops, RETAIL_SHOP_TAGS),
    [pendingShops]
  );
  const pendingFoodShops = useMemo(
    () => filterShopsByTags(pendingShops, FOOD_DRINK_TAGS),
    [pendingShops]
  );
  const retailShops = useMemo(
    () => filterShopsByTags(allShops, RETAIL_SHOP_TAGS),
    [allShops]
  );
  const foodShops = useMemo(
    () => filterShopsByTags(allShops, FOOD_DRINK_TAGS),
    [allShops]
  );

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function refresh() {
    router.refresh();
  }

  function retailShopRow(shop: Shop) {
    return (
      <AdminShopRow
        key={shop.id}
        shop={shop}
        editHref={`/admin/shops/${shop.id}`}
        tagLabels={shop.shop_tags.map((t) => SHOP_TAG_LABELS[t]).join(", ")}
        onDone={refresh}
      />
    );
  }

  function foodShopRow(shop: Shop) {
    return (
      <AdminShopRow
        key={shop.id}
        shop={shop}
        editHref={`/admin/food/${shop.id}`}
        tagLabels={shop.shop_tags.map((t) => SHOP_TAG_LABELS[t]).join(", ")}
        onDone={refresh}
      />
    );
  }

  if (!isAdmin) {
    return (
      <p className="text-red-600">
        Your account is not on the admin allowlist. Check ADMIN_EMAILS in your
        environment.
      </p>
    );
  }

  const queueCount = pendingEvents.length + pendingShops.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === id
                  ? "bg-sage text-white"
                  : "border border-border bg-surface text-ink"
              }`}
            >
              {id === "queue" ? `${label} (${queueCount})` : label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <KawaiiButton href="/admin/create/event" variant="secondary">
            New event
          </KawaiiButton>
          <KawaiiButton href="/admin/create/shop" variant="secondary">
            New shop
          </KawaiiButton>
          <KawaiiButton href="/admin/create/food" variant="secondary">
            New food & drink
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
            {pendingRetailShops.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">None waiting</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pendingRetailShops.map(retailShopRow)}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-xl font-bold text-periwinkle">
              Pending food & drink
            </h2>
            {pendingFoodShops.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">None waiting</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pendingFoodShops.map(foodShopRow)}
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
          {retailShops.length === 0 ? (
            <p className="text-sm text-ink-muted">No shops yet</p>
          ) : (
            retailShops.map(retailShopRow)
          )}
        </ul>
      )}

      {tab === "food" && (
        <ul className="space-y-2">
          {foodShops.length === 0 ? (
            <p className="text-sm text-ink-muted">No food & drink spots yet</p>
          ) : (
            foodShops.map(foodShopRow)
          )}
        </ul>
      )}
    </div>
  );
}
