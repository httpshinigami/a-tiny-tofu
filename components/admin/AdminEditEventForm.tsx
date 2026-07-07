"use client";

import { AdminMapLocationField } from "@/components/admin/AdminMapLocationField";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { patchStatus } from "@/components/admin/admin-actions";
import { toDatetimeLocal } from "@/lib/datetime-local";
import { formatMapLocation } from "@/lib/map-location";
import type { Event } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminEditEventForm({ event }: { event: Event }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(body: object) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/events/${event.id}`, {
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
    const fd = new FormData(e.currentTarget);
    const ok = await save({
      title: fd.get("title"),
      description: fd.get("description"),
      start_at: new Date(fd.get("start_at") as string).toISOString(),
      end_at: fd.get("end_at")
        ? new Date(fd.get("end_at") as string).toISOString()
        : "",
      venue_name: fd.get("venue_name"),
      address: fd.get("address"),
      map_location: fd.get("map_location") || "",
      external_url: fd.get("external_url") || "",
      image_url: fd.get("image_url") || "",
      status: fd.get("status"),
      admin_note: fd.get("admin_note") || "",
      honeypot: "",
    });
    if (ok) router.push("/admin");
  }

  async function approve() {
    const result = await patchStatus({
      type: "event",
      id: event.id,
      action: "approve",
    });
    if (result.ok) {
      router.push("/admin");
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm("Delete this event permanently?")) return;
    const result = await patchStatus({
      type: "event",
      id: event.id,
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
        <label className="kawaii-label" htmlFor="title">
          Title
          <RequiredMark />
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={event.title}
          className="kawaii-input"
        />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="description">
          Description
          <RequiredMark />
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={event.description}
          className="kawaii-input"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="kawaii-label" htmlFor="start_at">
            Start
            <RequiredMark />
          </label>
          <input
            id="start_at"
            name="start_at"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocal(event.start_at)}
            className="kawaii-input"
          />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="end_at">
            End <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="end_at"
            name="end_at"
            type="datetime-local"
            defaultValue={event.end_at ? toDatetimeLocal(event.end_at) : ""}
            className="kawaii-input"
          />
        </div>
      </div>
      <div>
        <label className="kawaii-label" htmlFor="venue_name">
          Venue
          <RequiredMark />
        </label>
        <input
          id="venue_name"
          name="venue_name"
          required
          defaultValue={event.venue_name}
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
          defaultValue={event.address}
          className="kawaii-input"
        />
      </div>
      <AdminMapLocationField
        defaultValue={formatMapLocation(event.lat, event.lng)}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="kawaii-label" htmlFor="external_url">
            External URL <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={event.external_url ?? ""}
            className="kawaii-input"
          />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="image_url">
            Image URL <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={event.image_url ?? ""}
            className="kawaii-input"
          />
        </div>
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
            defaultValue={event.status}
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="kawaii-label" htmlFor="admin_note">
            Admin note <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="admin_note"
            name="admin_note"
            defaultValue={event.admin_note ?? ""}
            className="kawaii-input"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        <KawaiiButton type="submit" variant="sage" disabled={busy}>
          Save changes
        </KawaiiButton>
        {event.status !== "approved" && (
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
