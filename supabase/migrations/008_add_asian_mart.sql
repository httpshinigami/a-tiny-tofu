-- Add asian_mart shop tag for food & drink (see lib/constants.ts)

ALTER TYPE public.shop_tag ADD VALUE IF NOT EXISTS 'asian_mart';
