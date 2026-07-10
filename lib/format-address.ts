const STREET_TYPE_ABBREVIATIONS: [RegExp, string][] = [
  [/\bStreet\b/gi, "St"],
  [/\bRoad\b/gi, "Rd"],
  [/\bAvenue\b/gi, "Ave"],
  [/\bBoulevard\b/gi, "Blvd"],
  [/\bDrive\b/gi, "Dr"],
  [/\bLane\b/gi, "Ln"],
  [/\bCourt\b/gi, "Ct"],
  [/\bPlace\b/gi, "Pl"],
  [/\bCrescent\b/gi, "Cres"],
  [/\bParade\b/gi, "Pde"],
  [/\bHighway\b/gi, "Hwy"],
  [/\bTerrace\b/gi, "Tce"],
  [/\bClose\b/gi, "Cl"],
  [/\bSquare\b/gi, "Sq"],
];

/**
 * Shortens AU street types and state names for display.
 * Only rewrites "Victoria" when it appears as the state (before a postcode,
 * country, or end) — not street/place names like "Victoria Street".
 */
export function formatDisplayAddress(address: string): string {
  let result = address.trim();

  for (const [pattern, replacement] of STREET_TYPE_ABBREVIATIONS) {
    result = result.replace(pattern, replacement);
  }

  // Mapbox often returns "Melbourne Victoria 3000" (no comma before state).
  // Only match when followed by postcode, "Australia", or end — not "Street" etc.
  result = result.replace(
    /\bVictoria\b(?=\s*,?\s*(?:\d{4}\b|Australia\b|$))/gi,
    "VIC"
  );

  return result;
}
