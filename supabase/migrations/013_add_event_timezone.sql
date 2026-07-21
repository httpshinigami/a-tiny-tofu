alter table public.events
  add column if not exists timezone text;

-- Existing Melbourne-focused listings default to local venue timezone.
update public.events
set timezone = 'Australia/Melbourne'
where timezone is null;
