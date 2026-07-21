export const MAX_URL_LENGTH = 2048;

const ALLOWED_SCHEMES = new Set(["http:", "https:"]);

/** Returns true for http(s) URLs without credentials or control characters. */
export function isSafeHttpUrl(value: string): boolean {
  if (value.length > MAX_URL_LENGTH) return false;
  if (/[\x00-\x1f\x7f]/.test(value)) return false;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  if (!ALLOWED_SCHEMES.has(parsed.protocol)) return false;
  if (!parsed.hostname) return false;
  if (parsed.username || parsed.password) return false;

  return true;
}

/** Returns a safe http(s) href, or null when the value must not be linked. */
export function toSafeHttpHref(
  value: string | null | undefined
): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return isSafeHttpUrl(trimmed) ? trimmed : null;
}

/** Returns true for same-origin relative paths (e.g. `/events/map`). */
export function isSafeInternalPath(value: string): boolean {
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (value.length > MAX_URL_LENGTH) return false;
  if (/[\x00-\x1f\x7f\\]/.test(value)) return false;

  const colon = value.indexOf(":");
  if (colon !== -1 && colon < value.indexOf("/", 1)) return false;

  return true;
}
