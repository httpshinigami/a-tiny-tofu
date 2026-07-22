"use client";

import { AdminExtrasSection } from "@/components/admin/AdminExtrasSection";
import { AdminMapLocationField } from "@/components/admin/AdminMapLocationField";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { patchStatus } from "@/components/admin/admin-actions";
import { AddressInput } from "@/components/forms/AddressInput";
import { DateTimePicker } from "@/components/forms/DateTimePicker";
import type { Status } from "@/lib/constants";
import { formatMapLocation } from "@/lib/map-location";
import type { Event } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function AdminEditEventForm({ event }: { event: Event }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mapLocation, setMapLocation] = useState(() =>
    formatMapLocation(event.lat, event.lng)
  );

  async function saveWithStatus(status: Extract<Status, "approved" | "pending">) {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const fd = new FormData(form);
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        start_at: fd.get("start_at"),
        end_at: fd.get("end_at") || "",
        venue_name: fd.get("venue_name"),
        address: fd.get("address"),
        map_location: fd.get("map_location") || "",
        external_url: fd.get("external_url") || "",
        tickets_url: fd.get("tickets_url") || "",
        image_url: fd.get("image_url") || "",
        instagram_url: fd.get("instagram_url") || "",
        status,
        admin_note: fd.get("admin_note") || "",
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
    <form
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
    >
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
          Description{" "}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={event.description}
          className="kawaii-input"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DateTimePicker
          id="start_at"
          name="start_at"
          label="Start"
          required
          defaultValue={event.start_at}
          timeZone={event.timezone ?? undefined}
        />
        <DateTimePicker
          id="end_at"
          name="end_at"
          label="End"
          optional
          defaultValue={event.end_at ?? undefined}
          timeZone={event.timezone ?? undefined}
        />
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
        <AddressInput
          id="address"
          name="address"
          required
          defaultValue={event.address}
          onSelect={(suggestion) =>
            setMapLocation(formatMapLocation(suggestion.lat, suggestion.lng))
          }
        />
      </div>
      <AdminMapLocationField
        value={mapLocation}
        onChange={setMapLocation}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="kawaii-label" htmlFor="external_url">
            Organiser link{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={event.external_url ?? ""}
            className="kawaii-input"
          />
          <p className="mt-1 text-xs text-ink-muted">
            Website, Instagram, or the best link to reach the organiser.
          </p>
        </div>
        <div>
          <label className="kawaii-label" htmlFor="tickets_url">
            Tickets link{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="tickets_url"
            name="tickets_url"
            type="url"
            defaultValue={event.tickets_url ?? ""}
            className="kawaii-input"
          />
          <p className="mt-1 text-xs text-ink-muted">
            Link to buy tickets or RSVP, if separate from the organiser link.
          </p>
        </div>
      </div>
      <div>
        <label className="kawaii-label" htmlFor="instagram_url">
          Instagram post link{" "}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          id="instagram_url"
          name="instagram_url"
          type="url"
          placeholder="https://www.instagram.com/p/…"
          defaultValue={event.instagram_url ?? ""}
          className="kawaii-input"
        />
        <p className="mt-1 text-xs text-ink-muted">
          Public post or reel — embeds when the event is selected on Markets &amp; Events.
        </p>
      </div>
      <AdminExtrasSection>
        <div>
          <label className="kawaii-label" htmlFor="image_url">
            Image link <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={event.image_url ?? ""}
            className="kawaii-input"
          />
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
