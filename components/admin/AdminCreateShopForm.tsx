"use client";

import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import {
  SHOP_TAGS,
  SHOP_TAG_LABELS,
  TAG_COLORS,
  type ShopTag,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SHOP_TAG_REQUIRED_MESSAGE } from "@/components/admin/admin-actions";

export function AdminCreateShopForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ShopTag[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected.length) {
      setError(SHOP_TAG_REQUIRED_MESSAGE);
      return;
    }
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      description: fd.get("description"),
      address: fd.get("address"),
      lat: parseFloat(fd.get("lat") as string),
      lng: parseFloat(fd.get("lng") as string),
      website: fd.get("website") || "",
      hours: fd.get("hours") || "",
      image_url: fd.get("image_url") || "",
      status: fd.get("status"),
      tags: selected,
      honeypot: "",
    };

    const res = await fetch("/api/admin/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        <input id="address" name="address" required className="kawaii-input" />
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
                selected.includes(tag) ? "ring-coral" : "ring-transparent"
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
          <label className="kawaii-label" htmlFor="lat">
            Lat
            <RequiredMark />
          </label>
          <input id="lat" name="lat" type="number" step="any" defaultValue={-37.8136} required className="kawaii-input" />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="lng">
            Lng
            <RequiredMark />
          </label>
          <input id="lng" name="lng" type="number" step="any" defaultValue={144.9631} required className="kawaii-input" />
        </div>
      </div>
      <div>
        <label className="kawaii-label" htmlFor="status">Status</label>
        <select id="status" name="status" className="kawaii-input" defaultValue="approved">
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <KawaiiButton type="submit">Save shop</KawaiiButton>
    </form>
  );
}
