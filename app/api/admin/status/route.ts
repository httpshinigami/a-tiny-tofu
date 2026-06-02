import {
  deleteEvent,
  deleteShop,
  updateEventStatus,
  updateShopStatus,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["event", "shop"]),
  id: z.string().uuid().or(z.string().min(1)),
  action: z.enum(["approve", "reject", "delete"]),
  admin_note: z.string().optional(),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { type, id, action, admin_note } = parsed.data;

  if (action === "delete") {
    const result =
      type === "event" ? await deleteEvent(id) : await deleteShop(id);
    return NextResponse.json({ ok: result.ok });
  }

  const status = action === "approve" ? "approved" : "rejected";
  const result =
    type === "event"
      ? await updateEventStatus(id, status, admin_note)
      : await updateShopStatus(id, status, admin_note);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
