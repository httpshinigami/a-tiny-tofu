-- Remove unused 'rejected' status from content_status enum.
-- Postgres cannot DROP ENUM values, and cannot alter a column
-- used by RLS policies — drop those policies first, then recreate.

DROP POLICY IF EXISTS "Public read approved events" ON public.events;
DROP POLICY IF EXISTS "Public read approved shops" ON public.shops;
DROP POLICY IF EXISTS "Public read shop tags for approved shops" ON public.shop_tags;
DROP POLICY IF EXISTS "Anyone can submit events" ON public.events;
DROP POLICY IF EXISTS "Anyone can submit shops" ON public.shops;
DROP POLICY IF EXISTS "Anyone can tag pending shops" ON public.shop_tags;

UPDATE public.events
SET status = 'pending'
WHERE status::text = 'rejected';

UPDATE public.shops
SET status = 'pending'
WHERE status::text = 'rejected';

CREATE TYPE public.content_status_new AS ENUM ('pending', 'approved');

ALTER TABLE public.events
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE public.content_status_new
    USING status::text::public.content_status_new;

ALTER TABLE public.shops
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE public.content_status_new
    USING status::text::public.content_status_new;

DROP TYPE public.content_status;
ALTER TYPE public.content_status_new RENAME TO content_status;

ALTER TABLE public.events
  ALTER COLUMN status SET DEFAULT 'pending'::public.content_status;

ALTER TABLE public.shops
  ALTER COLUMN status SET DEFAULT 'pending'::public.content_status;

CREATE POLICY "Public read approved events"
  ON public.events FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Public read approved shops"
  ON public.shops FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Public read shop tags for approved shops"
  ON public.shop_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shops s
      WHERE s.id = shop_id AND s.status = 'approved'
    )
  );

CREATE POLICY "Anyone can submit events"
  ON public.events FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "Anyone can submit shops"
  ON public.shops FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "Anyone can tag pending shops"
  ON public.shop_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops s
      WHERE s.id = shop_id AND s.status = 'pending'
    )
  );
