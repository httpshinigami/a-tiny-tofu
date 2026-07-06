-- Add shop tags that exist in lib/constants.ts but not in 001_initial.sql

ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'drinks';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'restaurant';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'gachas';
