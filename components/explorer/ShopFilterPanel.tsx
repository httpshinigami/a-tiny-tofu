"use client";

import { SHOP_TAG_LABELS, type ShopTag } from "@/lib/constants";
import type { ShopFilterCategory } from "@/lib/shop-filter-categories";
import { useEffect } from "react";

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

  return (
    <aside
      className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-cream shadow-sm md:min-h-[640px]"
      aria-label="Filter shops"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-ink">Filter</p>
        <div className="flex items-center gap-3">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-sage-dark underline"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-ink-muted transition hover:bg-surface hover:text-ink"
            aria-label="Close filters"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          {categories.map((category) => (
            <fieldset key={category.label}>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {category.label}
              </legend>
              <ul className="space-y-2">
                {category.tags.map((tag) => (
                  <li key={tag}>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-0.5 text-sm text-ink transition hover:bg-surface">
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
              </ul>
            </fieldset>
          ))}
        </div>
      </div>
    </aside>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
