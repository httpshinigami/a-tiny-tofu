/** Generic message returned for hard-rejected submissions (intentionally vague). */
export const CONTENT_REJECT_MESSAGE =
  "We couldn't accept this submission. Please check your details and try again.";

const REPEATED_CHAR_THRESHOLD = 6;
const ALL_CAPS_MIN_LENGTH = 16;

const PLACEHOLDER_VALUES = new Set([
  "asdf",
  "asdfgh",
  "fake",
  "na",
  "null",
  "n/a",
  "qwerty",
  "qwertyuiop",
  "sample",
  "test",
  "tbd",
  "undefined",
  "xxx",
]);

const SPAM_KEYWORDS = [
  "buy followers",
  "casino",
  "cialis",
  "click here",
  "crypto pump",
  "earn money fast",
  "free money",
  "get rich quick",
  "online gambling",
  "viagra",
  "work from home",
];

const HARD_PROFANITY = [
  "asshole",
  "bastard",
  "bitch",
  "cunt",
  "fuck",
  "motherfucker",
  "nigger",
  "nigga",
  "shit",
  "slut",
  "whore",
];

const CONTACT_IN_SHORT_FIELD =
  /(?:@[a-z0-9._-]{2,}\.[a-z]{2,}|\+?\d[\d\s().-]{7,}\d|whatsapp|telegram|signal|\bdm me\b)/i;

const URL_PATTERN = /https?:\/\/[^\s]+/gi;

export type EventSubmissionContent = {
  title: string;
  venue_name: string;
  description?: string;
  address: string;
};

export type ShopSubmissionContent = {
  name: string;
  description?: string;
  address: string;
  hours?: string;
};

function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/@/g, "a")
    .replace(/\$/g, "s");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasRepeatedCharacters(text: string): boolean {
  return new RegExp(`(.)\\1{${REPEATED_CHAR_THRESHOLD - 1},}`).test(text);
}

function isExcessiveAllCaps(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < ALL_CAPS_MIN_LENGTH) return false;
  if (!/[A-Z]/.test(trimmed)) return false;
  return trimmed === trimmed.toUpperCase();
}

function isPlaceholderValue(text: string): boolean {
  const normalized = text.trim().toLowerCase().replace(/[^a-z0-9/]/g, "");
  return PLACEHOLDER_VALUES.has(normalized);
}

function containsSpamKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function containsHardProfanity(text: string): boolean {
  const normalized = normalizeForMatching(text);
  return HARD_PROFANITY.some((term) => {
    if (normalized.includes(term)) return true;
    const re = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
    return re.test(text);
  });
}

function containsContactInfo(text: string): boolean {
  return CONTACT_IN_SHORT_FIELD.test(text);
}

function urlCount(text: string): number {
  return (text.match(URL_PATTERN) ?? []).length;
}

function rejectShortField(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (isPlaceholderValue(trimmed)) return true;
  if (hasRepeatedCharacters(trimmed)) return true;
  if (isExcessiveAllCaps(trimmed)) return true;
  if (containsHardProfanity(trimmed)) return true;
  if (containsContactInfo(trimmed)) return true;
  if (containsSpamKeyword(trimmed)) return true;
  return false;
}

function rejectLongField(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (hasRepeatedCharacters(trimmed)) return true;
  if (containsHardProfanity(trimmed)) return true;
  if (containsSpamKeyword(trimmed)) return true;
  if (urlCount(trimmed) > 1) return true;
  return false;
}

/** Returns true when the submission should be hard-rejected. */
export function rejectEventSubmissionContent(
  content: EventSubmissionContent
): boolean {
  if (rejectShortField(content.title)) return true;
  if (rejectShortField(content.venue_name)) return true;
  if (content.description && rejectLongField(content.description)) return true;
  if (rejectLongField(content.address)) return true;
  return false;
}

/** Returns true when the submission should be hard-rejected. */
export function rejectShopSubmissionContent(
  content: ShopSubmissionContent
): boolean {
  if (rejectShortField(content.name)) return true;
  if (content.description && rejectLongField(content.description)) return true;
  if (rejectLongField(content.address)) return true;
  if (content.hours && rejectLongField(content.hours)) return true;
  return false;
}
