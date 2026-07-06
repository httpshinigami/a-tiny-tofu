-- Add gundam and fashion shop tags (see lib/constants.ts)

ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'gundam';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'fashion';
