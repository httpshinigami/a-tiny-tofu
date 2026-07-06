export async function patchStatus(body: {
  type: "event" | "shop";
  id: string;
  action: "approve" | "reject" | "delete";
}) {
  const res = await fetch("/api/admin/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}
