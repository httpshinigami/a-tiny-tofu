import { z } from "zod";
import { SHOP_TAGS } from "./constants";

const mapLocationField = z.string().max(100).optional().or(z.literal(""));
const optionalUrl = z.url().or(z.literal("")).optional();

export const eventSubmitSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  start_at: z.string().min(1),
  end_at: z.string().optional().or(z.literal("")),
  venue_name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  image_url: optionalUrl,
  external_url: optionalUrl,
  website: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

export const shopSubmitSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  address: z.string().min(5).max(500),
  website: optionalUrl,
  hours: z.string().max(200).optional().or(z.literal("")),
  image_url: optionalUrl,
  tags: z.array(z.enum(SHOP_TAGS)).min(1),
  honeypot: z.string().max(0).optional(),
});

export const adminEventSchema = eventSubmitSchema.extend({
  status: z.enum(["pending", "approved"]),
  admin_note: z.string().max(500).optional().or(z.literal("")),
  map_location: mapLocationField,
});

export const adminShopSchema = shopSubmitSchema.extend({
  status: z.enum(["pending", "approved"]),
  admin_note: z.string().max(500).optional().or(z.literal("")),
  map_location: mapLocationField,
});
