"use client";

import { AdminMapLocationField } from "@/components/admin/AdminMapLocationField";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminCreateEventForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
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
      honeypot: "",
    };

    const res = await fetch("/api/admin/events", {
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
        <label className="kawaii-label" htmlFor="title">
          Title
          <RequiredMark />
        </label>
        <input id="title" name="title" required className="kawaii-input" />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="description">
          Description
          <RequiredMark />
        </label>
        <textarea id="description" name="description" required rows={3} className="kawaii-input" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="kawaii-label" htmlFor="start_at">
            Start
            <RequiredMark />
          </label>
          <input id="start_at" name="start_at" type="datetime-local" required className="kawaii-input" />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="end_at">
            End <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input id="end_at" name="end_at" type="datetime-local" className="kawaii-input" />
        </div>
      </div>
      <div>
        <label className="kawaii-label" htmlFor="venue_name">
          Venue
          <RequiredMark />
        </label>
        <input id="venue_name" name="venue_name" required className="kawaii-input" />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="address">
          Address
          <RequiredMark />
        </label>
        <input id="address" name="address" required className="kawaii-input" />
      </div>
      <AdminMapLocationField />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="kawaii-label" htmlFor="external_url">
            External URL <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input id="external_url" name="external_url" type="url" className="kawaii-input" />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="image_url">
            Image URL <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input id="image_url" name="image_url" type="url" className="kawaii-input" />
        </div>
      </div>
      <div>
        <label className="kawaii-label" htmlFor="status">Status</label>
        <select id="status" name="status" className="kawaii-input" defaultValue="approved">
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <KawaiiButton type="submit">Save event</KawaiiButton>
    </form>
  );
}
