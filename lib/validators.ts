import { z } from "zod";
import { SHOP_TAGS } from "./constants";

export const eventSubmitSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  start_at: z.string().min(1),
  end_at: z.string().optional().or(z.literal("")),
  venue_name: z.string().min(2).max(200),
  address: z.string().min(5).max(500),
  image_url: z.string().url().optional().or(z.literal("")),
  external_url: z.string().url().optional().or(z.literal("")),
  website: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

export const shopSubmitSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  address: z.string().min(5).max(500),
  website: z.string().url().optional().or(z.literal("")),
  hours: z.string().max(200).optional().or(z.literal("")),
  image_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.enum(SHOP_TAGS)).min(1),
  honeypot: z.string().max(0).optional(),
});

export const adminEventSchema = eventSubmitSchema.extend({
  lat: z.number(),
  lng: z.number(),
  status: z.enum(["pending", "approved", "rejected"]),
  admin_note: z.string().max(500).optional().or(z.literal("")),
});

export const adminShopSchema = shopSubmitSchema.extend({
  lat: z.number(),
  lng: z.number(),
  status: z.enum(["pending", "approved", "rejected"]),
  admin_note: z.string().max(500).optional().or(z.literal("")),
});
