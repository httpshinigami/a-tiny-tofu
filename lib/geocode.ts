import { MELBOURNE_CENTER } from "./constants";
import { parseMapLocation } from "./map-location";

export interface GeocodeResult {
  lat: number;
  lng: number;
}

async function geocodeWithMapbox(
  address: string
): Promise<GeocodeResult | null> {
  const token =
    process.env.MAPBOX_ACCESS_TOKEN ??
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) return null;

  const params = new URLSearchParams({
    access_token: token,
    country: "au",
    limit: "1",
    proximity: `${MELBOURNE_CENTER.lng},${MELBOURNE_CENTER.lat}`,
  });
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?${params}`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      features?: { center: [number, number] }[];
    };
    const feature = data.features?.[0];
    if (!feature) return null;
    return { lng: feature.center[0], lat: feature.center[1] };
  } catch {
    return null;
  }
}

async function geocodeWithNominatim(
  address: string
): Promise<GeocodeResult | null> {
  const query = encodeURIComponent(`${address}, Melbourne, Australia`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ATinyTofu/1.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data?.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  return (
    (await geocodeWithMapbox(address)) ?? (await geocodeWithNominatim(address))
  );
}

export function fallbackCoords(): GeocodeResult {
  return { ...MELBOURNE_CENTER };
}

export async function resolveCoords(
  address: string,
  mapLocation?: string
): Promise<GeocodeResult> {
  const parsed = mapLocation ? parseMapLocation(mapLocation) : null;
  if (parsed) return parsed;
  return (await geocodeAddress(address)) ?? fallbackCoords();
}
