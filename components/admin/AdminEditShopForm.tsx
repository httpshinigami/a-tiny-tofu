"use client";

import { patchStatus, SHOP_TAG_REQUIRED_MESSAGE } from "@/components/admin/admin-actions";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import {
  SHOP_TAGS,
  SHOP_TAG_LABELS,
  TAG_COLORS,
  type ShopTag,
} from "@/lib/constants";
import type { Shop } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminEditShopForm({ shop }: { shop: Shop }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<ShopTag[]>(shop.shop_tags);

  async function save(body: object) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/shops/${shop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      return false;
    }
    router.refresh();
    return true;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected.length) {
      setError(SHOP_TAG_REQUIRED_MESSAGE);
      return;
    }
    const fd = new FormData(e.currentTarget);
    const ok = await save({
      name: fd.get("name"),
      description: fd.get("description"),
      address: fd.get("address"),
      website: fd.get("website") || "",
      hours: fd.get("hours") || "",
      image_url: fd.get("image_url") || "",
      status: fd.get("status"),
      admin_note: fd.get("admin_note") || "",
      tags: selected,
      honeypot: "",
    });
    if (ok) router.push("/admin");
  }

  async function approve() {
    if (!selected.length) {
      setError(SHOP_TAG_REQUIRED_MESSAGE);
      return;
    }
    const result = await patchStatus({
      type: "shop",
      id: shop.id,
      action: "approve",
    });
    if (!result.ok) {
      setError(result.error ?? "Failed to approve");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this shop permanently?")) return;
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
    <form onSubmit={onSubmit} className="space-y-4">
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
        <input
          id="address"
          name="address"
          required
          defaultValue={shop.address}
          className="kawaii-input"
        />
      </div>
      <div>
        <p className="kawaii-label">
          Tags
          <RequiredMark />
        </p>
        <div className="flex flex-wrap gap-2">
          {SHOP_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setSelected((p) =>
                  p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]
                )
              }
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-2 ${
                selected.includes(tag) ? "ring-sage" : "ring-transparent"
              }`}
              style={{ backgroundColor: TAG_COLORS[tag] }}
            >
              {SHOP_TAG_LABELS[tag]}
            </button>
          ))}
        </div>
      </div>
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
      <div>
        <label className="kawaii-label" htmlFor="image_url">
          Image URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={shop.image_url ?? ""}
          className="kawaii-input"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="kawaii-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="kawaii-input"
            defaultValue={shop.status}
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
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
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        <KawaiiButton type="submit" variant="sage" disabled={busy}>
          Save changes
        </KawaiiButton>
        {shop.status !== "approved" && (
          <KawaiiButton type="button" variant="secondary" onClick={approve} disabled={busy}>
            Approve
          </KawaiiButton>
        )}
        <KawaiiButton type="button" variant="ghost" onClick={remove} disabled={busy}>
          Delete
        </KawaiiButton>
      </div>
    </form>
  );
}
