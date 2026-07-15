"use client";

import { EventSubmitForm } from "@/components/forms/EventSubmitForm";
import { ShopSubmitForm } from "@/components/forms/ShopSubmitForm";
import { FOOD_DRINK_TAGS, RETAIL_SHOP_TAGS } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type SubmitType = "event" | "shop" | "food";

const SUBMIT_TYPES: {
  type: SubmitType;
  label: string;
  href: string;
}[] = [
  { type: "event", label: "Markets & Events", href: "/submit/event" },
  { type: "shop", label: "Shops", href: "/submit/shop" },
  { type: "food", label: "Food & Drink", href: "/submit/food" },
];

const COPY: Record<SubmitType, { title: string; subtitle: string }> = {
  event: {
    title: "Submit a market or event",
    subtitle:
      "Share a cute market, pop-up, or meet-up. We review every submission before it goes live.",
  },
  shop: {
    title: "Submit a shop",
    subtitle:
      "Know a spot for collectibles, character goods, gachas, or other cute finds? Tell us!",
  },
  food: {
    title: "Submit a food & drink spot",
    subtitle:
      "Found a great bubble tea spot, matcha cafe, bakery, bingsu spot, meal spot, or Asian grocery? We'd love to hear about it.",
  },
};

interface Props {
  activeType: SubmitType;
}

export function SubmitHub({ activeType }: Props) {
  const router = useRouter();

  return (
    <>
      <Link
        href="/submit"
        className="text-sm font-medium text-sage-dark underline hover:text-sage"
      >
        ← Back to submit options
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUBMIT_TYPES.map(({ type, label, href }) => (
          <button
            key={type}
            type="button"
            onClick={() => router.push(href)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeType === type
                ? "bg-sage text-white"
                : "border border-border bg-surface text-ink hover:border-sage/50 hover:text-sage-dark"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <h1 className="mt-8 font-display text-3xl font-bold text-cocoa">
        {COPY[activeType].title}
      </h1>
      <p className="mt-2 text-ink-muted">{COPY[activeType].subtitle}</p>

      <div className="mt-8" key={activeType}>
        {activeType === "event" && <EventSubmitForm />}
        {activeType === "shop" && (
          <ShopSubmitForm
            tagOptions={RETAIL_SHOP_TAGS}
            tagPrompt="What do they sell?"
            successHref="/shops"
            successLabel="Back to shops"
          />
        )}
        {activeType === "food" && (
          <ShopSubmitForm
            tagOptions={FOOD_DRINK_TAGS}
            tagPrompt="What kind of spot is it?"
            successHref="/food"
            successLabel="Back to food & drink"
          />
        )}
      </div>
    </>
  );
}
