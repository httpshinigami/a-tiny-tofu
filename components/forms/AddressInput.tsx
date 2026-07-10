"use client";

import { MELBOURNE_CENTER } from "@/lib/constants";
import { useEffect, useId, useRef, useState } from "react";

export type AddressSuggestion = {
  placeName: string;
  lat: number;
  lng: number;
};

interface Props {
  id?: string;
  name?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  onSelect?: (suggestion: AddressSuggestion) => void;
}

type MapboxFeature = {
  place_name: string;
  center: [number, number];
};

export function AddressInput({
  id,
  name = "address",
  required,
  defaultValue = "",
  placeholder,
  className = "kawaii-input",
  onSelect,
}: Props) {
  const listId = useId();
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    if (!token || !focused) {
      setOpen(false);
      return;
    }
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    const query = value.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          access_token: token,
          autocomplete: "true",
          country: "au",
          limit: "5",
          proximity: `${MELBOURNE_CENTER.lng},${MELBOURNE_CENTER.lat}`,
          types: "address,poi,place",
        });
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = (await res.json()) as { features?: MapboxFeature[] };
        const next = (data.features ?? []).map((feature) => ({
          placeName: feature.place_name,
          lng: feature.center[0],
          lat: feature.center[1],
        }));
        setSuggestions(next);
        setOpen(next.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [token, value, focused]);

  useEffect(() => {
    return () => {
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };
  }, []);

  function choose(suggestion: AddressSuggestion) {
    skipNextFetch.current = true;
    setValue(suggestion.placeName);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    onSelect?.(suggestion);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      choose(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        required={required}
        value={value}
        placeholder={placeholder}
        className={className}
        autoComplete={token ? "off" : "street-address"}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
          blurTimeout.current = setTimeout(() => setOpen(false), 150);
        }}
        onKeyDown={onKeyDown}
      />
      {token && open && focused && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-surface py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.placeName}-${index}`} role="option">
              <button
                id={`${listId}-${index}`}
                type="button"
                aria-selected={index === activeIndex}
                className={`block w-full px-4 py-2.5 text-left text-sm transition ${
                  index === activeIndex
                    ? "bg-sage/15 text-sage-dark"
                    : "text-ink hover:bg-cream"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(suggestion)}
              >
                {suggestion.placeName}
              </button>
            </li>
          ))}
        </ul>
      )}
      {token && focused && loading && value.trim().length >= 3 && !open && (
        <p className="mt-1 text-xs text-ink-muted">Searching addresses…</p>
      )}
    </div>
  );
}
