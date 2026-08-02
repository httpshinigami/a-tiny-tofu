-- Store Australian state/territory for location filtering (VIC, NSW, …).
alter table public.events
  add column if not exists state text;

alter table public.shops
  add column if not exists state text;

-- Backfill from address abbreviations / full names commonly returned by Mapbox.
update public.events
set state = case
  when address ~* '\y(VIC|Victoria)\y' then 'VIC'
  when address ~* '\y(NSW|New South Wales)\y' then 'NSW'
  when address ~* '\y(QLD|Queensland)\y' then 'QLD'
  when address ~* '\y(SA|South Australia)\y' then 'SA'
  when address ~* '\y(WA|Western Australia)\y' then 'WA'
  when address ~* '\y(TAS|Tasmania)\y' then 'TAS'
  when address ~* '\y(ACT|Australian Capital Territory)\y' then 'ACT'
  when address ~* '\y(NT|Northern Territory)\y' then 'NT'
  else state
end
where state is null;

update public.shops
set state = case
  when address ~* '\y(VIC|Victoria)\y' then 'VIC'
  when address ~* '\y(NSW|New South Wales)\y' then 'NSW'
  when address ~* '\y(QLD|Queensland)\y' then 'QLD'
  when address ~* '\y(SA|South Australia)\y' then 'SA'
  when address ~* '\y(WA|Western Australia)\y' then 'WA'
  when address ~* '\y(TAS|Tasmania)\y' then 'TAS'
  when address ~* '\y(ACT|Australian Capital Territory)\y' then 'ACT'
  when address ~* '\y(NT|Northern Territory)\y' then 'NT'
  else state
end
where state is null;
