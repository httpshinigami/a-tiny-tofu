-- Add character goods and lifestyle shop tags (see lib/constants.ts)

ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'mofusand';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'miffy';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'disney';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'chiikawa';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'cartoon';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'jellycat';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'studio_ghibli';
ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'lifestyle';
