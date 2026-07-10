"use client";

import { MELBOURNE_CENTER } from "@/lib/constants";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Map, { type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

interface Props {
  children?: ReactNode;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  focusKey?: string | null;
}

export function MapShell({
  children,
  className = "h-[420px] w-full md:h-[520px]",
  center = MELBOURNE_CENTER,
  zoom = 13,
  focusKey,
}: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef<MapRef>(null);
  const initialCenter = useRef(center);
  const initialZoom = useRef(zoom);

  useEffect(() => {
    if (!focusKey) return;
    mapRef.current?.flyTo({
      center: [center.lng, center.lat],
      zoom,
      duration: 800,
    });
  }, [focusKey, center.lat, center.lng, zoom]);

  if (!token) {
    return (
      <div
        className={`flex items-center justify-center rounded-3xl border-2 border-peach-dark/30 bg-peach/30 ${className}`}
      >
        <p className="px-4 text-center font-display text-ink-muted">
          Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to enable the map.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-3xl border-2 border-peach-dark/30 shadow-inner ${className}`}
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        mapStyle={MAP_STYLE}
        initialViewState={{
          longitude: initialCenter.current.lng,
          latitude: initialCenter.current.lat,
          zoom: initialZoom.current,
        }}
        style={{ width: "100%", height: "100%" }}
        attributionControl
        reuseMaps
      >
        {children}
      </Map>
    </div>
  );
}
