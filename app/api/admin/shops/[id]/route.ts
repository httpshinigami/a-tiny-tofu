import { fallbackCoords, geocodeAddress } from "@/lib/geocode";
import { updateShop } from "@/lib/queries";
import { requireAdmin } from "@/lib/admin-auth";
import { adminShopSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json();
  const parsed = adminShopSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const d = parsed.data;
  const coords = (await geocodeAddress(d.address)) ?? fallbackCoords();
  const result = await updateShop(id, {
    name: d.name,
    description: d.description ?? "",
    address: d.address,
    lat: coords.lat,
    lng: coords.lng,
    website: d.website || null,
    hours: d.hours || null,
    image_url: d.image_url || null,
    status: d.status,
    admin_note: d.admin_note || null,
    tags: d.tags,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
