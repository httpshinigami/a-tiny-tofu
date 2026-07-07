import { updateEvent } from "@/lib/queries";
import { requireAdmin } from "@/lib/admin-auth";
import { resolveCoords } from "@/lib/geocode";
import { adminEventSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json();
  const parsed = adminEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const d = parsed.data;
  const coords = await resolveCoords(d.address, d.map_location);
  const result = await updateEvent(id, {
    title: d.title,
    description: d.description,
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

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
