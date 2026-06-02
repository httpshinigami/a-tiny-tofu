import type { ShopTag, Status } from "./constants";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_at: string;
  end_at: string | null;
  venue_name: string;
  address: string;
  lat: number;
  lng: number;
  image_url: string | null;
  external_url: string | null;
  status: Status;
  admin_note: string | null;
  created_at: string;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  website: string | null;
  hours: string | null;
  image_url: string | null;
  status: Status;
  admin_note: string | null;
  created_at: string;
  shop_tags: ShopTag[];
}

export type EventInsert = Omit<
  Event,
  "id" | "slug" | "status" | "admin_note" | "created_at"
> & { status?: Status };

export type ShopInsert = Omit<
  Shop,
  "id" | "slug" | "status" | "admin_note" | "created_at" | "shop_tags"
> & { status?: Status; tags?: ShopTag[] };
