"use client";

import { MELBOURNE_CENTER } from "@/lib/constants";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import Map, { type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

type LatLng = { lat: number; lng: number };

interface Props {
  children?: ReactNode;
  className?: string;
  /** Fly to this point when focusKey is set (e.g. selected marker). */
  center?: LatLng;
  zoom?: number;
  focusKey?: string | null;
  /** When there is no focusKey, fit the map to these points. */
  fitPoints?: LatLng[];
}

function getBounds(points: LatLng[]): [[number, number], [number, number]] {
  const lngs = points.map((p) => p.lng);
  const lats = points.map((p) => p.lat);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

export function MapShell({
  children,
  className = "h-[420px] w-full md:h-[520px]",
  center = MELBOURNE_CENTER,
  zoom = 13,
  focusKey = null,
  fitPoints = [],
}: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef<MapRef>(null);
  const hasAnimated = useRef(false);

  const fitKey = useMemo(
    () => fitPoints.map((p) => `${p.lat},${p.lng}`).join("|"),
    [fitPoints]
  );

  const points = useMemo(() => {
    if (!fitKey) return [] as LatLng[];
    return fitKey.split("|").map((pair) => {
      const [lat, lng] = pair.split(",").map(Number);
      return { lat, lng };
    });
  }, [fitKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const duration = hasAnimated.current ? 800 : 0;

    if (focusKey) {
      map.flyTo({
        center: [center.lng, center.lat],
        zoom,
        duration,
      });
      hasAnimated.current = true;
      return;
    }

    if (points.length === 0) {
      map.flyTo({
        center: [MELBOURNE_CENTER.lng, MELBOURNE_CENTER.lat],
        zoom: 12,
        duration,
      });
      hasAnimated.current = true;
      return;
    }

    if (points.length === 1) {
      map.flyTo({
        center: [points[0].lng, points[0].lat],
        zoom: 14,
        duration,
      });
      hasAnimated.current = true;
      return;
    }

    map.fitBounds(getBounds(points), {
      padding: 56,
      maxZoom: 14,
      duration,
    });
    hasAnimated.current = true;
  }, [focusKey, center.lat, center.lng, zoom, points]);

  const initialViewState =
    !focusKey && points.length > 1
      ? {
          bounds: getBounds(points),
          fitBoundsOptions: { padding: 56, maxZoom: 14 },
        }
      : !focusKey && points.length === 1
        ? {
            longitude: points[0].lng,
            latitude: points[0].lat,
            zoom: 14,
          }
        : {
            longitude: center.lng,
            latitude: center.lat,
            zoom,
          };

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
        initialViewState={initialViewState}
        onLoad={() => {
          // Re-apply once the map is ready (fitBounds needs a loaded map).
          const map = mapRef.current;
          if (!map || focusKey || points.length <= 1) return;
          map.fitBounds(getBounds(points), {
            padding: 56,
            maxZoom: 14,
            duration: 0,
          });
          hasAnimated.current = true;
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
