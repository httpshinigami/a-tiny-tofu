-- Add focused food & drink tags (see lib/constants.ts)
-- Remapping of old tags happens in 010 (new enum values can't be used in the same transaction).

ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'bubble_tea';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'matcha';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'bakery';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'meals';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'asian_grocery';
