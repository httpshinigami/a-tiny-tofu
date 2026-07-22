alter table public.events
  add column if not exists tickets_url text;
