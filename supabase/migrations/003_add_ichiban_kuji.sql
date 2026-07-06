-- Add ichiban_kuji shop tag (see lib/constants.ts)

ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'ichiban_kuji';
