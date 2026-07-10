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

const SHOP_UNSELECTED_PATH =
  "M96,140a12,12,0,1,1-12-12A12,12,0,0,1,96,140Zm76-12a12,12,0,1,0,12,12A12,12,0,0,0,172,128Zm60-80v88c0,52.93-46.65,96-104,96S24,188.93,24,136V48A16,16,0,0,1,51.31,36.69c.14.14.26.27.38.41L69,57a111.22,111.22,0,0,1,118.1,0L204.31,37.1c.12-.14.24-.27.38-.41A16,16,0,0,1,232,48Zm-16,0-21.56,24.8A8,8,0,0,1,183.63,74,88.86,88.86,0,0,0,168,64.75V88a8,8,0,1,1-16,0V59.05a97.43,97.43,0,0,0-16-2.72V88a8,8,0,1,1-16,0V56.33a97.43,97.43,0,0,0-16,2.72V88a8,8,0,1,1-16,0V64.75A88.86,88.86,0,0,0,72.37,74a8,8,0,0,1-10.81-1.17L40,48v88c0,41.66,35.21,76,80,79.67V195.31l-13.66-13.66a8,8,0,0,1,11.32-11.31L128,180.68l10.34-10.34a8,8,0,0,1,11.32,11.31L136,195.31v20.36c44.79-3.69,80-38,80-79.67Z";

const MAP_PIN_PATH =
  "M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z";

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
  const path =
    tone === "shop" && !selected ? SHOP_UNSELECTED_PATH : MAP_PIN_PATH;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      style={{ zIndex: selected ? 10 : 0 }}
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 256 256"
          aria-hidden
        >
          <path
            d={path}
            fill={color}
            stroke="#ffffff"
            strokeWidth={18}
            strokeLinejoin="round"
            paintOrder="stroke"
          />
        </svg>
      </button>
    </Marker>
  );
}
