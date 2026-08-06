import { requireAdmin } from "@/lib/admin-auth";
import { resolveEventSessions } from "@/lib/event-datetime";
import { updateEvent } from "@/lib/queries";
import { adminEventSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

function firstZodMessage(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid data";
  const path = issue.path.filter(Boolean).join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json();
  const parsed = adminEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: firstZodMessage(parsed.error),
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  const d = parsed.data;
  let schedule;
  try {
    schedule = await resolveEventSessions({
      address: d.address,
      mapLocation: d.map_location,
      sessions: d.sessions.map((session) => ({
        start_at: session.start_at,
        end_at: session.end_at || null,
      })),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Invalid date or time";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const result = await updateEvent(id, {
    title: d.title,
    description: d.description ?? "",
    start_at: schedule.start_at,
    end_at: schedule.end_at,
    sessions: schedule.sessions,
    venue_name: d.venue_name,
    address: d.address,
    lat: schedule.lat,
    lng: schedule.lng,
    state: schedule.state,
    timezone: schedule.timezone,
    image_url: d.image_url || null,
    external_url: d.external_url || null,
    tickets_url: d.tickets_url || null,
    instagram_url: d.instagram_url || null,
    status: d.status,
    admin_note: d.admin_note || null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
