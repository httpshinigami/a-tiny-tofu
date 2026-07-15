"use client";

import { RequiredMark } from "@/components/ui/RequiredMark";
import { SHOP_TAG_LABELS, type ShopTag } from "@/lib/constants";
import {
  RETAIL_FILTER_CATEGORIES,
  type ShopFilterCategory,
} from "@/lib/shop-filter-categories";

interface Props {
  options: readonly ShopTag[];
  selected: ShopTag[];
  onChange: (tags: ShopTag[]) => void;
  label: string;
  required?: boolean;
}

function groupOptions(options: readonly ShopTag[]): ShopFilterCategory[] {
  const optionSet = new Set(options);
  const grouped: ShopFilterCategory[] = [];
  const used = new Set<ShopTag>();

  for (const category of RETAIL_FILTER_CATEGORIES) {
    const tags = category.tags.filter((t) => optionSet.has(t));
    if (tags.length === 0) continue;
    grouped.push({ label: category.label, tags });
    for (const t of tags) used.add(t);
  }

  const leftover = options.filter((t) => !used.has(t));
  if (leftover.length > 0) {
    // Food/drink (or any uncategorised) tags: single section, or "Other"
    // when mixed with retail groups.
    grouped.push({
      label: grouped.length === 0 ? "Type" : "Other",
      tags: leftover,
    });
  }

  return grouped;
}

export function ShopTagPicker({
  options,
  selected,
  onChange,
  label,
  required,
}: Props) {
  const groups = groupOptions(options);

  function toggle(tag: ShopTag) {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag]
    );
  }

  return (
    <fieldset>
      <legend className="kawaii-label mb-2">
        {label}
        {required ? <RequiredMark /> : null}
      </legend>
      <p className="mb-3 text-sm text-ink-muted">
        Pick all that apply
        {selected.length > 0 ? ` · ${selected.length} selected` : ""}.
      </p>

      <div className="space-y-4">
        {groups.map((group) => {
          const sorted = [...group.tags].sort((a, b) =>
            SHOP_TAG_LABELS[a].localeCompare(SHOP_TAG_LABELS[b])
          );
          return (
            <div key={group.label}>
              {groups.length > 1 && (
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {group.label}
                </p>
              )}
              <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
                {sorted.map((tag) => {
                  const isOn = selected.includes(tag);
                  return (
                    <li key={tag}>
                      <label
                        className={`flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1.5 text-sm transition ${
                          isOn
                            ? "border-cocoa/40 bg-mint/50 text-ink"
                            : "border-border bg-white text-ink hover:border-cocoa/25"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isOn}
                          onChange={() => toggle(tag)}
                          className="size-3.5 shrink-0 rounded border-border text-cocoa focus:ring-cocoa/30"
                        />
                        <span className="leading-tight font-medium">
                          {SHOP_TAG_LABELS[tag]}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
