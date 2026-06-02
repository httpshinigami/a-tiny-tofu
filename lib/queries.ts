import type { ShopTag, Status } from "./constants";
import { SEED_EVENTS, SEED_SHOPS } from "./seed-data";
import { createAdminClient } from "./supabase/admin";
import type { Event, Shop } from "./types";
import { isSupabaseConfigured, slugify } from "./utils";

function mapShopRow(
  row: Record<string, unknown>,
  tags: ShopTag[] = []
): Shop {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    address: row.address as string,
    lat: row.lat as number,
    lng: row.lng as number,
    website: (row.website as string) ?? null,
    hours: (row.hours as string) ?? null,
    image_url: (row.image_url as string) ?? null,
    status: row.status as Status,
    admin_note: (row.admin_note as string) ?? null,
    created_at: row.created_at as string,
    shop_tags: tags,
  };
}

function mapEventRow(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string,
    start_at: row.start_at as string,
    end_at: (row.end_at as string) ?? null,
    venue_name: row.venue_name as string,
    address: row.address as string,
    lat: row.lat as number,
    lng: row.lng as number,
    image_url: (row.image_url as string) ?? null,
    external_url: (row.external_url as string) ?? null,
    status: row.status as Status,
    admin_note: (row.admin_note as string) ?? null,
    created_at: row.created_at as string,
  };
}

export async function getApprovedEvents(includePast = false): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    const now = Date.now();
    return SEED_EVENTS.filter(
      (e) => includePast || new Date(e.start_at).getTime() >= now - 86400000
    ).sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );
  }

  const supabase = createAdminClient();
  if (!supabase) return SEED_EVENTS;

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("start_at", { ascending: true });

  if (!includePast) {
    query = query.gte("start_at", new Date(Date.now() - 86400000).toISOString());
  }

  const { data, error } = await query;
  if (error || !data) return SEED_EVENTS;
  return data.map((row) => mapEventRow(row));
}

export async function getApprovedShops(tags?: ShopTag[]): Promise<Shop[]> {
  if (!isSupabaseConfigured()) {
    let shops = [...SEED_SHOPS];
    if (tags?.length) {
      shops = shops.filter((s) =>
        tags.every((t) => s.shop_tags.includes(t))
      );
    }
    return shops.sort((a, b) => a.name.localeCompare(b.name));
  }

  const supabase = createAdminClient();
  if (!supabase) return SEED_SHOPS;

  const { data: shopsData, error } = await supabase
    .from("shops")
    .select("*")
    .eq("status", "approved")
    .order("name", { ascending: true });

  if (error || !shopsData) return SEED_SHOPS;

  const { data: tagsData } = await supabase.from("shop_tags").select("*");

  const tagMap = new Map<string, ShopTag[]>();
  (tagsData ?? []).forEach((t: { shop_id: string; tag: ShopTag }) => {
    const list = tagMap.get(t.shop_id) ?? [];
    list.push(t.tag);
    tagMap.set(t.shop_id, list);
  });

  let shops = shopsData.map((row) =>
    mapShopRow(row, tagMap.get(row.id as string) ?? [])
  );

  if (tags?.length) {
    shops = shops.filter((s) => tags.every((t) => s.shop_tags.includes(t)));
  }

  return shops;
}

export async function getPendingEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapEventRow(row));
}

export async function getPendingShops(): Promise<Shop[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data: shopsData } = await supabase
    .from("shops")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (!shopsData) return [];
  const { data: tagsData } = await supabase.from("shop_tags").select("*");
  const tagMap = new Map<string, ShopTag[]>();
  (tagsData ?? []).forEach((t: { shop_id: string; tag: ShopTag }) => {
    const list = tagMap.get(t.shop_id) ?? [];
    list.push(t.tag);
    tagMap.set(t.shop_id, list);
  });
  return shopsData.map((row) =>
    mapShopRow(row, tagMap.get(row.id as string) ?? [])
  );
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  if (!isSupabaseConfigured()) return SEED_EVENTS;
  const supabase = createAdminClient();
  if (!supabase) return SEED_EVENTS;
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapEventRow(row));
}

export async function getAllShopsAdmin(): Promise<Shop[]> {
  if (!isSupabaseConfigured()) return SEED_SHOPS;
  const supabase = createAdminClient();
  if (!supabase) return SEED_SHOPS;
  const { data: shopsData } = await supabase.from("shops").select("*").order("created_at", { ascending: false });
  if (!shopsData) return SEED_SHOPS;
  const { data: tagsData } = await supabase.from("shop_tags").select("*");
  const tagMap = new Map<string, ShopTag[]>();
  (tagsData ?? []).forEach((t: { shop_id: string; tag: ShopTag }) => {
    const list = tagMap.get(t.shop_id) ?? [];
    list.push(t.tag);
    tagMap.set(t.shop_id, list);
  });
  return shopsData.map((row) =>
    mapShopRow(row, tagMap.get(row.id as string) ?? [])
  );
}

export async function insertEvent(
  payload: Omit<Event, "id" | "slug" | "created_at" | "admin_note"> & {
    slug?: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const slug = payload.slug ?? slugify(payload.title);
  if (!isSupabaseConfigured()) {
    return { ok: true };
  }
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Database not configured" };
  const { error } = await supabase.from("events").insert({
    title: payload.title,
    slug,
    description: payload.description,
    start_at: payload.start_at,
    end_at: payload.end_at,
    venue_name: payload.venue_name,
    address: payload.address,
    lat: payload.lat,
    lng: payload.lng,
    image_url: payload.image_url,
    external_url: payload.external_url,
    status: payload.status,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function insertShop(
  payload: Omit<Shop, "id" | "slug" | "created_at" | "admin_note" | "shop_tags"> & {
    slug?: string;
    tags: ShopTag[];
  }
): Promise<{ ok: boolean; error?: string; id?: string }> {
  const slug = payload.slug ?? slugify(payload.name);
  if (!isSupabaseConfigured()) {
    return { ok: true };
  }
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Database not configured" };
  const { data, error } = await supabase
    .from("shops")
    .insert({
      name: payload.name,
      slug,
      description: payload.description,
      address: payload.address,
      lat: payload.lat,
      lng: payload.lng,
      website: payload.website,
      hours: payload.hours,
      image_url: payload.image_url,
      status: payload.status,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Insert failed" };
  if (payload.tags.length) {
    await supabase.from("shop_tags").insert(
      payload.tags.map((tag) => ({ shop_id: data.id, tag }))
    );
  }
  return { ok: true, id: data.id };
}

export async function updateEventStatus(
  id: string,
  status: Status,
  admin_note?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured" };
  const { error } = await supabase
    .from("events")
    .update({ status, admin_note: admin_note ?? null })
    .eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateShopStatus(
  id: string,
  status: Status,
  admin_note?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured" };
  const { error } = await supabase
    .from("shops")
    .update({ status, admin_note: admin_note ?? null })
    .eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deleteEvent(id: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  const supabase = createAdminClient();
  if (!supabase) return { ok: false };
  await supabase.from("events").delete().eq("id", id);
  return { ok: true };
}

export async function deleteShop(id: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  const supabase = createAdminClient();
  if (!supabase) return { ok: false };
  await supabase.from("shop_tags").delete().eq("shop_id", id);
  await supabase.from("shops").delete().eq("id", id);
  return { ok: true };
}
