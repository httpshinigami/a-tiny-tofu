import {
  deleteEvent,
  deleteShop,
  getShopById,
  updateEventStatus,
  updateShopStatus,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils";
// the page asks the server to do something - NextResponse is what the server uses to reply, “Yep, that worked”, “Nope, you’re not allowed”, “Nope, the data was wrong”
import { NextResponse } from "next/server";
// Zod checks incoming JSON so bad form/API input doesn’t get saved to the database
import { z } from "zod";

const schema = z.object({
  type: z.enum(["event", "shop"]),
  // id must be a UUID, or a non-empty string
  id: z.uuid().or(z.string().min(1)),
  action: z.enum(["approve", "delete"]),
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

  // check if valid approve/delete request - type, id, action (not “is the whole event form filled out correctly?”)
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { type, id, action, admin_note } = parsed.data;

  if (action === "delete") {
    // result = did the DB delete succeed? ({ ok: true/false })
    const result =
      type === "event" ? await deleteEvent(id) : await deleteShop(id);
    return NextResponse.json({ ok: result.ok });
  }

  // if type is shop, check if it has at least one tag before approving
  if (type === "shop") {
    const shop = await getShopById(id);
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }
    if (!shop.shop_tags.length) {
      return NextResponse.json(
        { error: "Add at least one tag before approving" },
        { status: 400 }
      );
    }
  }

  const result =
    type === "event"
      ? await updateEventStatus(id, "approved", admin_note)
      : await updateShopStatus(id, "approved", admin_note);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
