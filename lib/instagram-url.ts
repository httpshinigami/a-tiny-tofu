import {
  isSafeHttpUrl,
  MAX_URL_LENGTH,
  normalizeHttpUrlInput,
} from "./safe-url";

const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"]);
const INSTAGRAM_POST_PATH = /^\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?$/;

/** Returns true for public Instagram post, reel, or IGTV URLs. */
export function isSafeInstagramPostUrl(value: string): boolean {
  const normalized = normalizeHttpUrlInput(value);
  if (normalized.length > MAX_URL_LENGTH || !isSafeHttpUrl(normalized)) {
    return false;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return false;
  }

  if (!INSTAGRAM_HOSTS.has(parsed.hostname)) return false;
  return INSTAGRAM_POST_PATH.test(parsed.pathname);
}

/** Returns a normalized Instagram embed URL, or null when unsafe. */
export function toSafeInstagramEmbedUrl(
  value: string | null | undefined
): string | null {
  if (!value) return null;
  const normalized = normalizeHttpUrlInput(value);
  if (!isSafeInstagramPostUrl(normalized)) return null;

  const parsed = new URL(normalized);
  parsed.search = "";
  parsed.hash = "";
  const path = parsed.pathname.endsWith("/")
    ? parsed.pathname
    : `${parsed.pathname}/`;
  return `https://www.instagram.com${path}`;
}

/** Returns the iframe src for an Instagram post/reel embed. */
export function getInstagramIframeSrc(
  value: string | null | undefined
): string | null {
  const safe = toSafeInstagramEmbedUrl(value);
  if (!safe) return null;

  const match = safe.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/i);
  if (!match) return null;

  return `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
}
