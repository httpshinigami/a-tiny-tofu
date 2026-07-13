-- Remap old food & drink tags to the new set, then remove old tag rows.
-- Old enum values remain in Postgres (enums can't drop values easily) but are unused by the app.

INSERT INTO public.shop_tags (shop_id, tag)
SELECT shop_id, 'bakery'::public.shop_tag
FROM public.shop_tags
WHERE tag = 'desserts'
ON CONFLICT DO NOTHING;

INSERT INTO public.shop_tags (shop_id, tag)
SELECT shop_id, 'bubble_tea'::public.shop_tag
FROM public.shop_tags
WHERE tag = 'drinks'
ON CONFLICT DO NOTHING;

INSERT INTO public.shop_tags (shop_id, tag)
SELECT shop_id, 'meals'::public.shop_tag
FROM public.shop_tags
WHERE tag = 'restaurant'
ON CONFLICT DO NOTHING;

INSERT INTO public.shop_tags (shop_id, tag)
SELECT shop_id, 'asian_grocery'::public.shop_tag
FROM public.shop_tags
WHERE tag = 'asian_mart'
ON CONFLICT DO NOTHING;

DELETE FROM public.shop_tags
WHERE tag IN ('desserts', 'drinks', 'restaurant', 'asian_mart');
