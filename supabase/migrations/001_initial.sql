-- a tiny tofu schema

create type public.content_status as enum ('pending', 'approved');

create type public.shop_tag as enum (
  'brunch',
  'desserts',
  'drinks',
  'restaurant',
  'photo_booths',
  'artist_goods',
  'anime_goods',
  'monchhichi',
  'blind_boxes',
  'gachas',
  'gundam',
  'fashion',
  'ichiban_kuji',
  'sanrio',
  'smiski',
  'sonny_angel',
  'sylvanian_families',
  'mofusand',
  'miffy',
  'disney',
  'chiikawa',
  'cartoon',
  'jellycat',
  'studio_ghibli',
  'lifestyle',
  'manga'
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  venue_name text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  image_url text,
  external_url text,
  status public.content_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now()
);

create table public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  website text,
  hours text,
  image_url text,
  status public.content_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now()
);

create table public.shop_tags (
  shop_id uuid not null references public.shops(id) on delete cascade,
  tag public.shop_tag not null,
  primary key (shop_id, tag)
);

create index events_status_start_idx on public.events (status, start_at);
create index shops_status_idx on public.shops (status);
create index shop_tags_tag_idx on public.shop_tags (tag);

alter table public.events enable row level security;
alter table public.shops enable row level security;
alter table public.shop_tags enable row level security;

-- Public read approved only
create policy "Public read approved events"
  on public.events for select
  using (status = 'approved');

create policy "Public read approved shops"
  on public.shops for select
  using (status = 'approved');

create policy "Public read shop tags for approved shops"
  on public.shop_tags for select
  using (
    exists (
      select 1 from public.shops s
      where s.id = shop_id and s.status = 'approved'
    )
  );

-- Anonymous submissions (pending only)
create policy "Anyone can submit events"
  on public.events for insert
  with check (status = 'pending');

create policy "Anyone can submit shops"
  on public.shops for insert
  with check (status = 'pending');

create policy "Anyone can tag pending shops"
  on public.shop_tags for insert
  with check (
    exists (
      select 1 from public.shops s
      where s.id = shop_id and s.status = 'pending'
    )
  );

-- Admin full access (authenticated users — app checks ADMIN_EMAILS)
create policy "Admin all events"
  on public.events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin all shops"
  on public.shops for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin all shop_tags"
  on public.shop_tags for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed data (optional — run after migration)
insert into public.events (title, slug, description, start_at, end_at, venue_name, address, lat, lng, status) values
  ('Kawaii Market at Queen Victoria', 'kawaii-market-queen-victoria', 'A weekend market stall row of cute illustrators, blind boxes, and plush traders.', now() + interval '7 days', now() + interval '9 days', 'Queen Victoria Market', 'Queen St, Melbourne VIC 3000', -37.8076, 144.9568, 'approved'),
  ('Pop-up Art Gallery: Pastel Dreams', 'pastel-dreams-popup', 'Local artists showcase kawaii illustrations, stickers, and zines.', now() + interval '14 days', null, 'Flinders Lane Studio', '45 Flinders Ln, Melbourne VIC 3000', -37.815, 144.971, 'approved'),
  ('Sonny Angel Swap Meet', 'sonny-angel-swap-meet', 'Bring your doubles and trade with fellow collectors.', now() + interval '21 days', now() + interval '21 days 5 hours', 'Community Hall Carlton', '220 Rathdowne St, Carlton VIC 3053', -37.8, 144.966, 'approved');

insert into public.shops (name, slug, description, address, lat, lng, hours, status) values
  ('Monchhichi & Co.', 'monchhichi-and-co', 'Vintage Monchhichi plush and gifts.', 'Shop 12, Melbourne Central, Melbourne VIC 3000', -37.8105, 144.963, 'Mon–Sat 10am–6pm', 'approved'),
  ('Pastel Parfait House', 'pastel-parfait-house', 'Kawaii desserts and brunch.', '88 Bourke St, Melbourne VIC 3000', -37.813, 144.968, 'Daily 11am–7pm', 'approved'),
  ('Smiski Corner', 'smiski-corner', 'Smiskis, blind boxes, and weekend brunch.', '210 Bridge Rd, Richmond VIC 3121', -37.818, 145.004, 'Wed–Sun 11am–5pm', 'approved');

insert into public.shop_tags (shop_id, tag)
select id, 'monchhichi'::public.shop_tag from public.shops where slug = 'monchhichi-and-co'
union all select id, 'desserts' from public.shops where slug = 'pastel-parfait-house'
union all select id, 'restaurant' from public.shops where slug = 'pastel-parfait-house'
union all select id, 'smiski' from public.shops where slug = 'smiski-corner'
union all select id, 'restaurant' from public.shops where slug = 'smiski-corner'
union all select id, 'desserts' from public.shops where slug = 'smiski-corner';
