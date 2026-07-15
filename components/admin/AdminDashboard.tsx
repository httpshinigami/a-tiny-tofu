"use client";

import { AdminEventRow, AdminShopRow } from "@/components/admin/AdminListRows";
import { FOOD_DRINK_TAGS, RETAIL_SHOP_TAGS, SHOP_TAG_LABELS } from "@/lib/constants";
import { filterShopsByTags } from "@/lib/shop-categories";
import type { Event, Shop } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Tab = "queue" | "events" | "shops" | "food";

const TABS: { id: Tab; label: string }[] = [
  { id: "queue", label: "Queue" },
  { id: "events", label: "All events" },
  { id: "shops", label: "All shops" },
  { id: "food", label: "All food & drink" },
];

const STATUS_RANK = { pending: 0, rejected: 1, approved: 2 } as const;

function sortShopsForAllView(shops: Shop[]): Shop[] {
  return [...shops].sort((a, b) => {
    const statusDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

function sortEventsForAllView(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const statusDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}

function matchesQuery(haystack: string, query: string): boolean {
  return haystack.toLowerCase().includes(query);
}

function filterEventsBySearch(events: Event[], query: string): Event[] {
  const q = query.trim().toLowerCase();
  if (!q) return events;
  return events.filter(
    (event) =>
      matchesQuery(event.title, q) ||
      matchesQuery(event.venue_name, q) ||
      matchesQuery(event.address, q) ||
      matchesQuery(event.description, q)
  );
}

function filterShopsBySearch(shops: Shop[], query: string): Shop[] {
  const q = query.trim().toLowerCase();
  if (!q) return shops;
  return shops.filter((shop) => {
    const tagLabels = shop.shop_tags
      .map((t) => SHOP_TAG_LABELS[t])
      .join(" ");
    return (
      matchesQuery(shop.name, q) ||
      matchesQuery(shop.address, q) ||
      matchesQuery(shop.description, q) ||
      matchesQuery(tagLabels, q)
    );
  });
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
  const [tab, setTab] = useState<Tab>("queue");
  const [search, setSearch] = useState("");

  const pendingRetailShops = useMemo(
    () =>
      filterShopsBySearch(
        filterShopsByTags(pendingShops, RETAIL_SHOP_TAGS),
        search
      ),
    [pendingShops, search]
  );
  const pendingFoodShops = useMemo(
    () =>
      filterShopsBySearch(
        filterShopsByTags(pendingShops, FOOD_DRINK_TAGS),
        search
      ),
    [pendingShops, search]
  );
  const filteredPendingEvents = useMemo(
    () => filterEventsBySearch(pendingEvents, search),
    [pendingEvents, search]
  );
  const retailShops = useMemo(
    () =>
      filterShopsBySearch(
        sortShopsForAllView(filterShopsByTags(allShops, RETAIL_SHOP_TAGS)),
        search
      ),
    [allShops, search]
  );
  const foodShops = useMemo(
    () =>
      filterShopsBySearch(
        sortShopsForAllView(filterShopsByTags(allShops, FOOD_DRINK_TAGS)),
        search
      ),
    [allShops, search]
  );
  const sortedEvents = useMemo(
    () => filterEventsBySearch(sortEventsForAllView(allEvents), search),
    [allEvents, search]
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
          <Link
            href="/admin/create/event"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-sage/50 hover:text-sage-dark"
          >
            New event
          </Link>
          <Link
            href="/admin/create/shop"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-sage/50 hover:text-sage-dark"
          >
            New shop
          </Link>
          <Link
            href="/admin/create/food"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-sage/50 hover:text-sage-dark"
          >
            New food & drink
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-ink-muted transition hover:bg-surface hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="admin-search" className="sr-only">
          Search listings
        </label>
        <input
          id="admin-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, address, tags…"
          className="kawaii-input max-w-xl"
        />
      </div>

      {tab === "queue" && (
        <>
          <section>
            <h2 className="text-xl font-bold text-cocoa">Pending events</h2>
            {filteredPendingEvents.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">
                {search.trim() ? "No matching pending events" : "None waiting"}
              </p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPendingEvents.map((e) => (
                  <AdminEventRow key={e.id} event={e} onDone={refresh} />
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-xl font-bold text-cocoa">Pending shops</h2>
            {pendingRetailShops.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">
                {search.trim() ? "No matching pending shops" : "None waiting"}
              </p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pendingRetailShops.map(retailShopRow)}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-xl font-bold text-cocoa">
              Pending food & drink
            </h2>
            {pendingFoodShops.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">
                {search.trim()
                  ? "No matching pending food & drink"
                  : "None waiting"}
              </p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pendingFoodShops.map(foodShopRow)}
              </ul>
            )}
          </section>
        </>
      )}

      {tab === "events" && (
        <>
          {sortedEvents.length === 0 ? (
            <p className="text-sm text-ink-muted">
              {search.trim() ? "No matching events" : "No events yet"}
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedEvents.map((e) => (
                <AdminEventRow key={e.id} event={e} onDone={refresh} />
              ))}
            </ul>
          )}
        </>
      )}

      {tab === "shops" && (
        <>
          {retailShops.length === 0 ? (
            <p className="text-sm text-ink-muted">
              {search.trim() ? "No matching shops" : "No shops yet"}
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {retailShops.map(retailShopRow)}
            </ul>
          )}
        </>
      )}

      {tab === "food" && (
        <>
          {foodShops.length === 0 ? (
            <p className="text-sm text-ink-muted">
              {search.trim()
                ? "No matching food & drink spots"
                : "No food & drink spots yet"}
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {foodShops.map(foodShopRow)}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
