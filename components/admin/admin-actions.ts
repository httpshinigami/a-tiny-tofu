export const SHOP_TAG_REQUIRED_MESSAGE = "Pick at least one tag";

export async function patchStatus(body: {
  type: "event" | "shop";
  id: string;
  action: "approve" | "reject" | "delete";
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/admin/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: data.error ?? "Request failed" };
  }
  return { ok: true };
}
