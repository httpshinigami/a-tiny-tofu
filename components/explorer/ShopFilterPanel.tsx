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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

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

  function toggleCategory(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  return (
    <aside
      className="flex h-full max-h-[50vh] flex-col overflow-hidden md:max-h-none"
      aria-label="Filter shops"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {selected.length > 0 && (
          <div className="mb-1 flex justify-end">
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-sage-dark underline"
            >
              Clear all
            </button>
          </div>
        )}
        <div className="divide-y divide-border">
          {categories.map((category) => {
            const isOpen = !collapsed.has(category.label);
            const sortedTags = [...category.tags].sort((a, b) =>
              SHOP_TAG_LABELS[a].localeCompare(SHOP_TAG_LABELS[b])
            );
            const selectedCount = sortedTags.filter((t) =>
              selected.includes(t)
            ).length;

            return (
              <div key={category.label} className="py-2">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.label)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-2 py-1.5 text-left transition hover:opacity-80"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {category.label}
                    {selectedCount > 0 && (
                      <span className="ml-2 normal-case text-sage-dark">
                        ({selectedCount})
                      </span>
                    )}
                  </span>
                  <Chevron open={isOpen} />
                </button>

                {isOpen && (
                  <ul className="space-y-1 pb-2 pt-1">
                    {sortedTags.map((tag) => (
                      <li key={tag}>
                        <label className="flex cursor-pointer items-center gap-2.5 px-0.5 py-0.5 text-sm text-ink transition hover:text-sage-dark">
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 text-ink-muted transition ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
