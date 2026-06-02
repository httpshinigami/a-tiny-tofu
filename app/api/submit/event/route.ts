import { fallbackCoords, geocodeAddress } from "@/lib/geocode";
import { insertEvent } from "@/lib/queries";
import { eventSubmitSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

function toIso(datetimeLocal: string): string {
  if (!datetimeLocal) return "";
  const d = new Date(datetimeLocal);
  return d.toISOString();
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = eventSubmitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
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
