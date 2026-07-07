import { resolveCoords } from "@/lib/geocode";
import { insertEvent } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils";
import { adminEventSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = adminEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const d = parsed.data;
  const coords = await resolveCoords(d.address, d.map_location);
  const result = await insertEvent({
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
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
