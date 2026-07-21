import { resolveEventSchedule } from "@/lib/event-datetime";
import { insertEvent } from "@/lib/queries";
import { eventSubmitSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = eventSubmitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  let schedule;
  try {
    schedule = await resolveEventSchedule({
      address: data.address,
      startAt: data.start_at,
      endAt: data.end_at || null,
    });
  } catch {
    return NextResponse.json({ error: "Invalid date or time" }, { status: 400 });
  }

  const result = await insertEvent({
    title: data.title,
    description: data.description ?? "",
    start_at: schedule.start_at,
    end_at: schedule.end_at,
    venue_name: data.venue_name,
    address: data.address,
    lat: schedule.lat,
    lng: schedule.lng,
    timezone: schedule.timezone,
    image_url: data.image_url || null,
    external_url: data.external_url || null,
    status: "pending",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
