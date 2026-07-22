"use client";

import { AdminExtrasSection } from "@/components/admin/AdminExtrasSection";
import { AdminMapLocationField } from "@/components/admin/AdminMapLocationField";
import { SHOP_TAG_REQUIRED_MESSAGE } from "@/components/admin/admin-actions";
import { AddressInput } from "@/components/forms/AddressInput";
import { ShopTagPicker } from "@/components/forms/ShopTagPicker";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { type ShopTag, type Status } from "@/lib/constants";
import { formatMapLocation } from "@/lib/map-location";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface Props {
  tagOptions: readonly ShopTag[];
  tagPrompt?: string;
}

export function AdminCreateShopForm({
  tagOptions,
  tagPrompt = "Tags",
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<ShopTag[]>([]);
  const [mapLocation, setMapLocation] = useState("");

  async function saveWithStatus(status: Extract<Status, "approved" | "pending">) {
    if (!selected.length) {
      setError(SHOP_TAG_REQUIRED_MESSAGE);
      return;
    }
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const fd = new FormData(form);
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/shops", {
      method: "POST",
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
        tags: selected,
        honeypot: "",
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
      return;
    }
    router.push("/admin");
    router.refresh();
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
        <input id="name" name="name" required className="kawaii-input" />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="description">
          Description <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea id="description" name="description" rows={3} className="kawaii-input" />
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
            Hours <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input id="hours" name="hours" className="kawaii-input" />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="website">
            Website <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input id="website" name="website" type="url" className="kawaii-input" />
        </div>
      </div>
      <AdminExtrasSection>
        <div>
          <label className="kawaii-label" htmlFor="image_url">
            Image link <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input id="image_url" name="image_url" type="url" className="kawaii-input" />
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
      </div>
    </form>
  );
}
