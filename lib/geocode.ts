import { MELBOURNE_CENTER } from "./constants";

export interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(
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

export function fallbackCoords(): GeocodeResult {
  return { ...MELBOURNE_CENTER };
}
