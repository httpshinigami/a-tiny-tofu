"use client";

import {
  LOCATION_FILTER_OPTIONS,
  type LocationFilter,
} from "@/lib/au-state";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  value: LocationFilter[];
  onChange: (next: LocationFilter[]) => void;
  optionCounts?: Partial<Record<LocationFilter, number>>;
  /** Called when the menu opens (e.g. to close sibling panels). */
  onOpen?: () => void;
  renderButton: (props: {
    open: boolean;
    active: boolean;
    label: string;
    count: number;
    onClick: () => void;
  }) => ReactNode;
}

export function LocationFilterMenu({
  value,
  onChange,
  optionCounts,
  onOpen,
  renderButton,
}: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function select(id: LocationFilter) {
    onChange(value.includes(id) ? [] : [id]);
    setOpen(false);
  }

  const label =
    value.length === 0
      ? "Location"
      : (LOCATION_FILTER_OPTIONS.find((o) => o.id === value[0])?.label ??
        "Location");

  return (
    <div className="relative" ref={menuRef}>
      {renderButton({
        open,
        active: open || value.length > 0,
        label,
        count: value.length,
        onClick: () => {
          const willOpen = !open;
          setOpen(willOpen);
          if (willOpen) onOpen?.();
        },
      })}
      {open && (
        <div
          className="absolute left-0 top-full z-30 mt-2 w-56 max-h-[min(70vh,22rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-3 shadow-lg"
          role="listbox"
          aria-label="Location"
        >
          <ul className="space-y-1">
            {LOCATION_FILTER_OPTIONS.map((option) => {
              const checked = value.includes(option.id);
              const optionCount = optionCounts?.[option.id] ?? 0;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => select(option.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      checked
                        ? "bg-pink/40 font-semibold text-ink"
                        : "text-ink hover:bg-surface/80"
                    }`}
                  >
                    <span>
                      {option.label}{" "}
                      <span className="font-normal text-ink-muted tabular-nums">
                        ({optionCount})
                      </span>
                    </span>
                    {checked && <span aria-hidden>✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onChange([]);
                setOpen(false);
              }}
              className="mt-2 w-full text-left text-xs font-medium text-sage-dark underline"
            >
              Clear location
            </button>
          )}
        </div>
      )}
    </div>
  );
}
