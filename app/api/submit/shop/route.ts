import { fallbackCoords, geocodeAddress } from "@/lib/geocode";
import { insertShop } from "@/lib/queries";
import { shopSubmitSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = shopSubmitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const coords =
    (await geocodeAddress(data.address)) ?? fallbackCoords();

  const result = await insertShop({
    name: data.name,
    description: data.description ?? "",
    address: data.address,
    lat: coords.lat,
    lng: coords.lng,
    website: data.website || null,
    hours: data.hours || null,
    image_url: data.image_url || null,
    status: "pending",
    tags: data.tags,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
