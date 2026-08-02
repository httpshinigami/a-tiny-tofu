/** Australian state / territory codes stored on events and shops. */
export type AuState =
  | "VIC"
  | "NSW"
  | "QLD"
  | "SA"
  | "WA"
  | "TAS"
  | "ACT"
  | "NT";

/** States exposed in explorer location filters. */
export type LocationFilter = "VIC" | "NSW";

export const LOCATION_FILTER_OPTIONS: {
  id: LocationFilter;
  label: string;
}[] = [
  { id: "VIC", label: "Victoria" },
  { id: "NSW", label: "NSW" },
];

const CODE_ALIASES: Record<string, AuState> = {
  VIC: "VIC",
  VICTORIA: "VIC",
  NSW: "NSW",
  "NEW SOUTH WALES": "NSW",
  QLD: "QLD",
  QUEENSLAND: "QLD",
  SA: "SA",
  "SOUTH AUSTRALIA": "SA",
  WA: "WA",
  "WESTERN AUSTRALIA": "WA",
  TAS: "TAS",
  TASMANIA: "TAS",
  ACT: "ACT",
  "AUSTRALIAN CAPITAL TERRITORY": "ACT",
  NT: "NT",
  "NORTHERN TERRITORY": "NT",
};

/**
 * Parse an AU state from an address string.
 * Prefers abbreviations (VIC, NSW) and full names that look like the state
 * token (before a postcode, "Australia", or end) — not street names like
 * "Victoria Street".
 */
export function parseAuStateFromAddress(address: string): AuState | null {
  const text = address.trim();
  if (!text) return null;

  const abbrev = text.match(
    /\b(VIC|NSW|QLD|SA|WA|TAS|ACT|NT)\b(?=\s*,?\s*(?:\d{4}\b|Australia\b|$|,))/i
  );
  if (abbrev) {
    return CODE_ALIASES[abbrev[1].toUpperCase()] ?? null;
  }

  const full = text.match(
    /\b(Victoria|New South Wales|Queensland|South Australia|Western Australia|Tasmania|Australian Capital Territory|Northern Territory)\b(?=\s*,?\s*(?:\d{4}\b|Australia\b|$|,))/i
  );
  if (full) {
    return CODE_ALIASES[full[1].toUpperCase()] ?? null;
  }

  // Mapbox / loose forms: "Melbourne VIC 3000" without comma before state.
  const looseAbbrev = text.match(/\b(VIC|NSW|QLD|SA|WA|TAS|ACT|NT)\b/i);
  if (looseAbbrev) {
    return CODE_ALIASES[looseAbbrev[1].toUpperCase()] ?? null;
  }

  return null;
}

/** Normalize Mapbox / Nominatim region labels into AuState. */
export function parseAuStateFromRegionLabel(
  value: string | null | undefined
): AuState | null {
  if (!value) return null;
  const cleaned = value
    .trim()
    .replace(/^AU[-_\s]?/i, "")
    .toUpperCase();
  return CODE_ALIASES[cleaned] ?? null;
}

/**
 * Rough mainland bounding boxes — used when address has no state cue but
 * we have coordinates (e.g. admin map-location override).
 */
export function inferAuStateFromCoords(
  lat: number,
  lng: number
): AuState | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  // Tasmania
  if (lat < -39.2 && lat > -44.0 && lng > 143.5 && lng < 149.0) return "TAS";
  // ACT (nested inside NSW — check before NSW)
  if (lat < -35.1 && lat > -35.95 && lng > 148.7 && lng < 149.4) return "ACT";
  // Victoria
  if (lat < -34.0 && lat > -39.2 && lng > 140.9 && lng < 150.0) return "VIC";
  // NSW (incl. coastal)
  if (lat < -28.1 && lat > -37.6 && lng > 140.9 && lng < 153.7) return "NSW";
  // Queensland
  if (lat < -9.5 && lat > -29.2 && lng > 137.9 && lng < 153.6) return "QLD";
  // South Australia
  if (lat < -26.0 && lat > -38.2 && lng > 129.0 && lng < 141.1) return "SA";
  // Western Australia
  if (lat < -13.5 && lat > -35.2 && lng > 112.9 && lng < 129.1) return "WA";
  // Northern Territory
  if (lat < -10.5 && lat > -26.1 && lng > 129.0 && lng < 138.1) return "NT";

  return null;
}

export function resolveAuState(input: {
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  regionHint?: string | null;
}): AuState | null {
  return (
    parseAuStateFromRegionLabel(input.regionHint) ??
    (input.address ? parseAuStateFromAddress(input.address) : null) ??
    (input.lat != null && input.lng != null
      ? inferAuStateFromCoords(input.lat, input.lng)
      : null)
  );
}

export function matchesLocationFilter(
  state: AuState | null | undefined,
  address: string,
  locations: LocationFilter[]
): boolean {
  if (locations.length === 0) return true;
  const resolved = state ?? parseAuStateFromAddress(address);
  if (!resolved) return false;
  return (locations as string[]).includes(resolved);
}
