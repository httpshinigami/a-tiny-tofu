"use client";

import { AdminExtrasSection } from "@/components/admin/AdminExtrasSection";
import { AdminMapLocationField } from "@/components/admin/AdminMapLocationField";
import { patchStatus, SHOP_TAG_REQUIRED_MESSAGE } from "@/components/admin/admin-actions";
import { AddressInput } from "@/components/forms/AddressInput";
import { ShopTagPicker } from "@/components/forms/ShopTagPicker";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { type ShopTag, type Status } from "@/lib/constants";
import { formatMapLocation } from "@/lib/map-location";
import type { Shop } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

interface Props {
  shop: Shop;
  tagOptions: readonly ShopTag[];
  tagPrompt?: string;
  deleteConfirmMessage?: string;
}

export function AdminEditShopForm({
  shop,
  tagOptions,
  tagPrompt = "Tags",
  deleteConfirmMessage = "Delete this shop permanently?",
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mapLocation, setMapLocation] = useState(() =>
    formatMapLocation(shop.lat, shop.lng)
  );

  const tagOptionSet = useMemo(() => new Set<string>(tagOptions), [tagOptions]);

  const preservedTags = useMemo(
    () => shop.shop_tags.filter((t) => !tagOptionSet.has(t)),
    [shop.shop_tags, tagOptionSet]
  );
  const [selected, setSelected] = useState<ShopTag[]>(() =>
    shop.shop_tags.filter((t) => tagOptionSet.has(t))
  );

  function allTags() {
    return [...selected, ...preservedTags];
  }

  async function saveWithStatus(status: Extract<Status, "approved" | "pending">) {
    if (!selected.length && !preservedTags.length) {
      setError(SHOP_TAG_REQUIRED_MESSAGE);
      return;
    }
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const fd = new FormData(form);
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/shops/${shop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        description: fd.get("description"),
        address: fd.get("address"),
        map_location: fd.get("map_location") || "",
        website: fd.get("website") || "",
        hours: fd.get("hours") || "",
        image_url: fd.get("image_url") || "",
        status,
        admin_note: fd.get("admin_note") || "",
        tags: allTags(),
        honeypot: "",
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function remove() {
    if (!confirm(deleteConfirmMessage)) return;
    const result = await patchStatus({
      type: "shop",
      id: shop.id,
      action: "delete",
    });
    if (result.ok) {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
    >
      <div>
        <label className="kawaii-label" htmlFor="name">
          Name
          <RequiredMark />
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={shop.name}
          className="kawaii-input"
        />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="description">
          Description <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={shop.description}
          className="kawaii-input"
        />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="address">
          Address
          <RequiredMark />
        </label>
        <AddressInput
          id="address"
          name="address"
          required
          defaultValue={shop.address}
          onSelect={(suggestion) =>
            setMapLocation(formatMapLocation(suggestion.lat, suggestion.lng))
          }
        />
      </div>
      <AdminMapLocationField
        value={mapLocation}
        onChange={setMapLocation}
      />
      <ShopTagPicker
        options={tagOptions}
        selected={selected}
        onChange={setSelected}
        label={tagPrompt}
        required
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="kawaii-label" htmlFor="hours">
            Hours
          </label>
          <input
            id="hours"
            name="hours"
            defaultValue={shop.hours ?? ""}
            className="kawaii-input"
          />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={shop.website ?? ""}
            className="kawaii-input"
          />
        </div>
      </div>
      <AdminExtrasSection>
        <div>
          <label className="kawaii-label" htmlFor="image_url">
            Image link
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={shop.image_url ?? ""}
            className="kawaii-input"
          />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="admin_note">
            Admin note
          </label>
          <input
            id="admin_note"
            name="admin_note"
            defaultValue={shop.admin_note ?? ""}
            className="kawaii-input"
          />
        </div>
      </AdminExtrasSection>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        <KawaiiButton
          type="button"
          variant="sage"
          disabled={busy}
          onClick={() => saveWithStatus("approved")}
        >
          Approved
        </KawaiiButton>
        <KawaiiButton
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => saveWithStatus("pending")}
        >
          Pending
        </KawaiiButton>
        <KawaiiButton type="button" variant="ghost" onClick={remove} disabled={busy}>
          Delete
        </KawaiiButton>
      </div>
    </form>
  );
}
