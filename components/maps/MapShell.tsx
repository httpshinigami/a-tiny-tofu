"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { MELBOURNE_CENTER } from "@/lib/constants";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function MapShell({
  children,
  className = "h-[420px] w-full md:h-[520px]",
  center = MELBOURNE_CENTER,
  zoom = 13,
}: Props) {
  return (
    <div className={`overflow-hidden rounded-3xl border-2 border-peach-dark/30 shadow-inner ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}
