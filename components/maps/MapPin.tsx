"use client";

import { markerColor, markerSize } from "@/components/maps/markers";
import { Marker } from "react-map-gl/mapbox";

interface Props {
  longitude: number;
  latitude: number;
  selected?: boolean;
  tone: "shop" | "event";
  onClick?: () => void;
}

export function MapPin({
  longitude,
  latitude,
  selected = false,
  tone,
  onClick,
}: Props) {
  const size = markerSize(selected);
  const color = markerColor(
    selected ? (`${tone}-selected` as const) : tone
  );

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.();
      }}
    >
      <button
        type="button"
        aria-label="Map marker"
        className="block cursor-pointer border-0 bg-transparent p-0"
        style={{ width: size, height: size }}
      >
        <span
          className="block shadow-[0_2px_6px_rgba(61,52,41,0.25)]"
          style={{
            width: size,
            height: size,
            background: color,
            border: "2px solid #3d3429",
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
          }}
        />
      </button>
    </Marker>
  );
}
