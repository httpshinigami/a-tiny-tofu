export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatEventDate(start: string, end: string | null): string {
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const startDate = new Date(start);
  const startStr = startDate.toLocaleString("en-AU", opts);
  if (!end) return startStr;
  const endDate = new Date(end);
  if (startDate.toDateString() === endDate.toDateString()) {
    const endTime = endDate.toLocaleString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${startStr} – ${endTime}`;
  }
  return `${startStr} – ${endDate.toLocaleString("en-AU", opts)}`;
}

export function parseTagsParam(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
