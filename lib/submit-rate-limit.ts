import { createAdminClient } from "./supabase/admin";
import { isSupabaseConfigured } from "./utils";

export const SUBMISSION_DAILY_LIMIT = 5;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function isSubmissionRateLimitBypassed(request: Request): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const ip = getClientIp(request);
  const allowlist = (process.env.RATE_LIMIT_BYPASS_IPS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return allowlist.includes(ip);
}

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function consumeSubmissionRateLimit(
  request: Request
): Promise<{ allowed: boolean; limit: number }> {
  const limit = SUBMISSION_DAILY_LIMIT;

  if (isSubmissionRateLimitBypassed(request)) {
    return { allowed: true, limit };
  }

  if (!isSupabaseConfigured()) {
    return { allowed: true, limit };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { allowed: true, limit };
  }

  const ip = getClientIp(request);
  const { data, error } = await supabase.rpc("try_consume_submission_rate", {
    p_ip: ip,
    p_day: utcDay(),
    p_limit: limit,
  });

  if (error) {
    console.error("submission rate limit check failed:", error.message);
    return { allowed: true, limit };
  }

  return { allowed: Boolean(data), limit };
}

export function submissionRateLimitResponse(limit: number) {
  return Response.json(
    {
      error: `You've reached today's submission limit (${limit} per day). Try again tomorrow.`,
    },
    { status: 429 }
  );
}
