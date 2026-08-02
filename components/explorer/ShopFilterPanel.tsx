"use client";

import { SHOP_TAG_LABELS, type ShopTag } from "@/lib/constants";
import type { ShopFilterCategory } from "@/lib/shop-filter-categories";
import { useEffect, useState } from "react";

interface Props {
  categories: readonly ShopFilterCategory[];
  selected: ShopTag[];
  onChange: (tags: ShopTag[]) => void;
  onClose: () => void;
}

export function ShopFilterPanel({
  categories,
  selected,
  onChange,
  onClose,
}: Props) {
  const [activeLabel, setActiveLabel] = useState(categories[0]?.label ?? "");

  useEffect(() => {
    if (!categories.some((c) => c.label === activeLabel)) {
      setActiveLabel(categories[0]?.label ?? "");
    }
  }, [categories, activeLabel]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function toggleTag(tag: ShopTag) {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag]
    );
  }

  const activeCategory =
    categories.find((c) => c.label === activeLabel) ?? categories[0];
  const activeTags = activeCategory
    ? [...activeCategory.tags].sort((a, b) =>
        SHOP_TAG_LABELS[a].localeCompare(SHOP_TAG_LABELS[b])
      )
    : [];

  return (
    <aside
      className="flex max-h-[min(90vh,48rem)] overflow-hidden"
      aria-label="Filter shops"
    >
      {/* Category list */}
      <div className="flex w-[11.5rem] shrink-0 flex-col border-r border-border sm:w-52">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Filters
          </p>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-sage-dark underline"
            >
              Clear
            </button>
          )}
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto py-1">
          {categories.map((category) => {
            const selectedCount = category.tags.filter((t) =>
              selected.includes(t)
            ).length;
            const isActive = category.label === activeCategory?.label;
            return (
              <li key={category.label}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveLabel(category.label)}
                  onFocus={() => setActiveLabel(category.label)}
                  onClick={() => setActiveLabel(category.label)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-pink/35 font-semibold text-ink"
                      : "text-ink hover:bg-pink/15"
                  }`}
                >
                  <span className="min-w-0 leading-snug">{category.label}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {selectedCount > 0 && (
                      <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                        {selectedCount}
                      </span>
                    )}
                    <ChevronRight />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Nested options for the hovered/selected category */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold text-ink">
            {activeCategory?.label ?? "Options"}
          </p>
        </div>
        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {activeTags.map((tag) => (
            <li key={tag}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-2 text-sm text-ink transition hover:bg-pink/10">
                <input
                  type="checkbox"
                  checked={selected.includes(tag)}
                  onChange={() => toggleTag(tag)}
                  className="size-4 rounded border-border text-sage focus:ring-sage"
                />
                {SHOP_TAG_LABELS[tag]}
              </label>
            </li>
          ))}
          {activeTags.length === 0 && (
            <li className="px-1 py-2 text-sm text-ink-muted">No options</li>
          )}
        </ul>
      </div>
    </aside>
  );
}

function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-ink-muted"
      aria-hidden
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
