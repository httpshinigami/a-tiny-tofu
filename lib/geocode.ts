import { resolveAuState, type AuState } from "./au-state";
import { MELBOURNE_CENTER } from "./constants";
import { parseMapLocation } from "./map-location";

export interface GeocodeResult {
  lat: number;
  lng: number;
  state: AuState | null;
}

type MapboxForwardFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    context?: {
      region?: {
        name?: string;
        region_code?: string;
        region_code_full?: string;
      };
    };
  };
};

async function geocodeWithMapbox(
  address: string
): Promise<GeocodeResult | null> {
  const token =
    process.env.MAPBOX_ACCESS_TOKEN ??
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) return null;

  const params = new URLSearchParams({
    q: address,
    access_token: token,
    language: "en",
    country: "au",
    limit: "1",
    proximity: `${MELBOURNE_CENTER.lng},${MELBOURNE_CENTER.lat}`,
    types: "address,poi,place",
  });
  const url = `https://api.mapbox.com/search/searchbox/v1/forward?${params}`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { features?: MapboxForwardFeature[] };
    const feature = data.features?.[0];
    const coords = feature?.geometry?.coordinates;
    if (!coords) return null;

    const region = feature?.properties?.context?.region;
    const lat = coords[1];
    const lng = coords[0];
    return {
      lng,
      lat,
      state: resolveAuState({
        address,
        lat,
        lng,
        regionHint:
          region?.region_code_full ?? region?.region_code ?? region?.name,
      }),
    };
  } catch {
    return null;
  }
}

async function geocodeWithNominatim(
  address: string
): Promise<GeocodeResult | null> {
  const query = encodeURIComponent(`${address}, Australia`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=1&countrycodes=au`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ATinyTofu/1.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      lat: string;
      lon: string;
      address?: { state?: string; state_code?: string };
    }[];
    if (!data?.length) return null;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    const regionHint = data[0].address?.state_code ?? data[0].address?.state;
    return {
      lat,
      lng,
      state: resolveAuState({ address, lat, lng, regionHint }),
    };
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

export function fallbackCoords(address?: string): GeocodeResult {
  const lat = MELBOURNE_CENTER.lat;
  const lng = MELBOURNE_CENTER.lng;
  return {
    lat,
    lng,
    state: resolveAuState({ address, lat, lng }) ?? "VIC",
  };
}

export async function resolveCoords(
  address: string,
  mapLocation?: string
): Promise<GeocodeResult> {
  const parsed = mapLocation ? parseMapLocation(mapLocation) : null;
  if (parsed) {
    return {
      ...parsed,
      state: resolveAuState({
        address,
        lat: parsed.lat,
        lng: parsed.lng,
      }),
    };
  }
  return (await geocodeAddress(address)) ?? fallbackCoords(address);
}
