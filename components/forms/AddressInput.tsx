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

type SuggestResult = {
  mapbox_id: string;
  name: string;
  feature_type: string;
  full_address?: string;
  place_formatted: string;
  label: string;
};

type RetrieveFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    name: string;
    feature_type: string;
    full_address?: string;
    place_formatted?: string;
  };
};

function newSessionToken() {
  return crypto.randomUUID();
}

function formatPlaceLabel(result: {
  name: string;
  feature_type: string;
  full_address?: string;
  place_formatted?: string;
}) {
  const { name, feature_type, full_address, place_formatted } = result;
  if (full_address) {
    if (
      feature_type === "poi" &&
      !full_address.toLowerCase().includes(name.toLowerCase())
    ) {
      return `${name}, ${full_address}`;
    }
    return full_address;
  }
  return [name, place_formatted].filter(Boolean).join(", ");
}

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
  const sessionToken = useRef(newSessionToken());
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SuggestResult[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
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
          q: query,
          access_token: token,
          session_token: sessionToken.current,
          language: "en",
          limit: "5",
          country: "au",
          proximity: `${MELBOURNE_CENTER.lng},${MELBOURNE_CENTER.lat}`,
          types: "address,poi,place",
        });
        const res = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?${params}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = (await res.json()) as {
          suggestions?: Omit<SuggestResult, "label">[];
        };
        const next = (data.suggestions ?? [])
          .filter((suggestion) => suggestion.feature_type !== "category")
          .map((suggestion) => ({
            ...suggestion,
            label: formatPlaceLabel(suggestion),
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

  async function choose(suggestion: SuggestResult) {
    if (!token || retrieving) return;

    setRetrieving(true);
    try {
      const params = new URLSearchParams({
        access_token: token,
        session_token: sessionToken.current,
        language: "en",
      });
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${encodeURIComponent(suggestion.mapbox_id)}?${params}`
      );
      if (!res.ok) return;

      const data = (await res.json()) as { features?: RetrieveFeature[] };
      const feature = data.features?.[0];
      if (!feature) return;

      const [lng, lat] = feature.geometry.coordinates;
      const placeName = formatPlaceLabel(feature.properties);

      skipNextFetch.current = true;
      setValue(placeName);
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      sessionToken.current = newSessionToken();
      onSelect?.({ placeName, lat, lng });
    } finally {
      setRetrieving(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0 || retrieving) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      void choose(suggestions[activeIndex]);
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
        aria-busy={retrieving || undefined}
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
            <li key={`${suggestion.mapbox_id}-${index}`} role="option">
              <button
                id={`${listId}-${index}`}
                type="button"
                disabled={retrieving}
                aria-selected={index === activeIndex}
                className={`block w-full px-4 py-2.5 text-left text-sm transition disabled:opacity-60 ${
                  index === activeIndex
                    ? "bg-sage/15 text-sage-dark"
                    : "text-ink hover:bg-surface"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => void choose(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {token &&
        focused &&
        (loading || retrieving) &&
        value.trim().length >= 3 &&
        !open && (
          <p className="mt-1 text-xs text-ink-muted">
            {retrieving ? "Getting location…" : "Searching places…"}
          </p>
        )}
    </div>
  );
}
