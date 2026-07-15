import { fallbackCoords, geocodeAddress } from "@/lib/geocode";
import { insertEvent } from "@/lib/queries";
import { eventSubmitSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import { z } from "zod";

// convert datetime-local string to ISO string
function toIso(datetimeLocal: string): string {
  if (!datetimeLocal) return "";
  const d = new Date(datetimeLocal);
  return d.toISOString();
}

export async function POST(request: Request) {
  // validate the request body against the eventSubmitSchema
  const json = await request.json();
  const parsed = eventSubmitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  // check if the honeypot field is filled out - if so, return ok so the bot thinks it succeeded but no events are submitted
  if (data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const coords =
    (await geocodeAddress(data.address)) ?? fallbackCoords();

  const result = await insertEvent({
    title: data.title,
    description: data.description,
    start_at: toIso(data.start_at),
    end_at: data.end_at ? toIso(data.end_at) : null,
    venue_name: data.venue_name,
    address: data.address,
    lat: coords.lat,
    lng: coords.lng,
    image_url: data.image_url || null,
    external_url: data.external_url || null,
    status: "pending",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
