"use client";

import { AddressInput } from "@/components/forms/AddressInput";
import { DateTimePicker } from "@/components/forms/DateTimePicker";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { useState } from "react";

export function EventSubmitForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());

    const res = await fetch("/api/submit/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(
        typeof data.error === "string"
          ? data.error
          : "Something went wrong"
      );
      return;
    }
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="border-y border-border py-10 text-center">
        <p className="font-display text-2xl font-bold text-ink">
          Thank you!
        </p>
        <p className="mt-2 text-ink-muted">
          We&apos;ll review your event and publish it soon.
        </p>
        <div className="mt-6">
          <KawaiiButton href="/events">Back to events</KawaiiButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        name="honeypot"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />
      <div>
        <label className="kawaii-label" htmlFor="title">
          Event title
          <RequiredMark />
        </label>
        <input id="title" name="title" required className="kawaii-input" />
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
          className="kawaii-input"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DateTimePicker
          id="start_at"
          name="start_at"
          label="Start date & time"
          required
        />
        <DateTimePicker
          id="end_at"
          name="end_at"
          label="End"
          optional
        />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="venue_name">
          Venue name
          <RequiredMark />
        </label>
        <input
          id="venue_name"
          name="venue_name"
          required
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
          placeholder="Street, suburb, VIC"
        />
      </div>
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
            className="kawaii-input"
          />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="tickets_url">
            Tickets URL{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="tickets_url"
            name="tickets_url"
            type="url"
            className="kawaii-input"
          />
        </div>
      </div>
      {/* Image URL hidden for now — re-enable when image uploads/URLs are supported */}
      {/*
      <div>
        <label className="kawaii-label" htmlFor="image_url">
          Image URL (optional)
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          className="kawaii-input"
        />
      </div>
      */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <KawaiiButton type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit for review"}
      </KawaiiButton>
    </form>
  );
}
