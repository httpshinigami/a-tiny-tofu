import { z } from "zod";
import { SHOP_TAGS } from "./constants";
import { isSafeInstagramPostUrl } from "./instagram-url";
import { isSafeHttpUrl, MAX_URL_LENGTH } from "./safe-url";

const mapLocationField = z.string().max(100).optional().or(z.literal(""));

const safeUrlMessage = "Only http and https URLs are allowed";

const safeHttpUrl = z
  .url()
  .max(MAX_URL_LENGTH)
  .refine(isSafeHttpUrl, { message: safeUrlMessage });

const optionalSafeHttpUrl = z.union([z.literal(""), safeHttpUrl]).optional();

const instagramUrlMessage = "Must be an Instagram post or reel URL";

const optionalInstagramUrl = z
  .union([
    z.literal(""),
    z.url().max(MAX_URL_LENGTH).refine(isSafeInstagramPostUrl, {
      message: instagramUrlMessage,
    }),
  ])
  .optional();

export const eventSubmitSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  start_at: z.string().min(1),
  end_at: z.string().optional().or(z.literal("")),
  venue_name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  external_url: optionalSafeHttpUrl,
  tickets_url: optionalSafeHttpUrl,
  website: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

export const shopSubmitSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  address: z.string().min(5).max(500),
  website: optionalSafeHttpUrl,
  hours: z.string().max(200).optional().or(z.literal("")),
  image_url: optionalSafeHttpUrl,
  tags: z.array(z.enum(SHOP_TAGS)).min(1),
  honeypot: z.string().max(0).optional(),
});

export const adminEventSchema = eventSubmitSchema.extend({
  status: z.enum(["pending", "approved"]),
  admin_note: z.string().max(500).optional().or(z.literal("")),
  map_location: mapLocationField,
  external_url: optionalSafeHttpUrl,
  tickets_url: optionalSafeHttpUrl,
  image_url: optionalSafeHttpUrl,
  instagram_url: optionalInstagramUrl,
});

export const adminShopSchema = shopSubmitSchema.extend({
  status: z.enum(["pending", "approved"]),
  admin_note: z.string().max(500).optional().or(z.literal("")),
  map_location: mapLocationField,
});
