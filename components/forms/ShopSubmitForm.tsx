"use client";

import { SHOP_TAG_REQUIRED_MESSAGE } from "@/components/admin/admin-actions";
import { AddressInput } from "@/components/forms/AddressInput";
import { ShopTagPicker } from "@/components/forms/ShopTagPicker";
import { KawaiiButton } from "@/components/ui/KawaiiButton";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { type ShopTag } from "@/lib/constants";
import { useState } from "react";

interface Props {
  tagOptions: readonly ShopTag[];
  tagPrompt?: string;
  successHref?: string;
  successLabel?: string;
}

export function ShopSubmitForm({
  tagOptions,
  tagPrompt = "What do they sell?",
  successHref = "/shops",
  successLabel = "Back to shops",
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ShopTag[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected.length) {
      setError(SHOP_TAG_REQUIRED_MESSAGE);
      return;
    }
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      ...Object.fromEntries(fd.entries()),
      tags: selected,
    };

    const res = await fetch("/api/submit/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong");
      return;
    }
    setStatus("success");
    form.reset();
    setSelected([]);
  }

  if (status === "success") {
    return (
      <div className="border-y border-border py-10 text-center">
        <p className="font-display text-2xl font-bold text-ink">
          Thank you!
        </p>
        <p className="mt-2 text-ink-muted">
          We&apos;ll review your shop listing soon.
        </p>
        <div className="mt-6">
          <KawaiiButton href={successHref}>{successLabel}</KawaiiButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
      <div>
        <label className="kawaii-label" htmlFor="name">
          Shop name
          <RequiredMark />
        </label>
        <input id="name" name="name" required className="kawaii-input" />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="description">
          Description <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="kawaii-input"
        />
      </div>
      <div>
        <label className="kawaii-label" htmlFor="address">
          Address
          <RequiredMark />
        </label>
        <AddressInput id="address" name="address" required />
      </div>
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
            Hours (optional)
          </label>
          <input id="hours" name="hours" className="kawaii-input" />
        </div>
        <div>
          <label className="kawaii-label" htmlFor="website">
            Website (optional)
          </label>
          <input id="website" name="website" type="url" className="kawaii-input" />
        </div>
      </div>
      <div>
        <label className="kawaii-label" htmlFor="image_url">
          Image link (optional)
        </label>
        <input id="image_url" name="image_url" type="url" className="kawaii-input" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <KawaiiButton type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit for review"}
      </KawaiiButton>
    </form>
  );
}
