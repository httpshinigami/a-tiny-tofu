import { fallbackCoords, geocodeAddress } from "@/lib/geocode";
import { insertShop } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils";
import { adminShopSchema } from "@/lib/validators";
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
  const parsed = adminShopSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const d = parsed.data;
  const coords = (await geocodeAddress(d.address)) ?? fallbackCoords();
  const result = await insertShop({
    name: d.name,
    description: d.description ?? "",
    address: d.address,
    lat: coords.lat,
    lng: coords.lng,
    website: d.website || null,
    hours: d.hours || null,
    image_url: d.image_url || null,
    status: d.status,
    tags: d.tags,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
