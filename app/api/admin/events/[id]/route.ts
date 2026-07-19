import { updateEvent } from "@/lib/queries";
import { requireAdmin } from "@/lib/admin-auth";
import { resolveCoords } from "@/lib/geocode";
import { adminEventSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// Handles PATCH /api/admin/events/[id] — update an existing event
// request = body/headers; params = id from the URL.
export async function PATCH(request: Request, { params }: Params) {
  // checks if current user is an allowlisted admin
  if (!(await requireAdmin())) {
    // if not an admin, return 401 Unauthorized error (no admin → don’t update the event)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // get the event ID from the URL
  const { id } = await params;
  // get the request body (the updated event fields the form sent)
  const json = await request.json();
  // check that data is valid (required fields, correct types, allowed status, etc.)
  const parsed = adminEventSchema.safeParse(json);
  // if not valid, return 400 Bad Request error
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const d = parsed.data;
  // get the event’s coordinates from the address
  const coords = await resolveCoords(d.address, d.map_location);
  // update the event in the database
  // || null fields become null in the DB
  const result = await updateEvent(id, {
    title: d.title,
    description: d.description ?? "",
    start_at: d.start_at,
    end_at: d.end_at || null,
    venue_name: d.venue_name,
    address: d.address,
    lat: coords.lat,
    lng: coords.lng,
    image_url: d.image_url || null,
    external_url: d.external_url || null,
    status: d.status,
    admin_note: d.admin_note || null,
  });

  // if there was an error updating the event, return 500 Internal Server Error
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  // if successful, return 200 OK
  return NextResponse.json({ ok: true });
}
