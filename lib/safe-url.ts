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
