import { updateEvent } from "@/lib/queries";
import { requireAdmin } from "@/lib/admin-auth";
import { resolveEventSchedule } from "@/lib/event-datetime";
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
  let schedule;
  try {
    schedule = await resolveEventSchedule({
      address: d.address,
      mapLocation: d.map_location,
      startAt: d.start_at,
      endAt: d.end_at || null,
    });
  } catch {
    return NextResponse.json({ error: "Invalid date or time" }, { status: 400 });
  }

  const result = await updateEvent(id, {
    title: d.title,
    description: d.description ?? "",
    start_at: schedule.start_at,
    end_at: schedule.end_at,
    venue_name: d.venue_name,
    address: d.address,
    lat: schedule.lat,
    lng: schedule.lng,
    timezone: schedule.timezone,
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
