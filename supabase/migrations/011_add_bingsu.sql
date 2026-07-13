-- Add bingsu food & drink tag (see lib/constants.ts)

ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'bingsu';
