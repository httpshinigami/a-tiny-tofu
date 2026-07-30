create table public.event_sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz,
  created_at timestamptz not null default now()
);

create index event_sessions_event_start_idx
  on public.event_sessions (event_id, start_at);

alter table public.event_sessions enable row level security;

grant select, insert, update, delete on table public.event_sessions
  to anon, authenticated, service_role;

create policy "Public read event_sessions for approved events"
  on public.event_sessions for select
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.status = 'approved'
    )
  );

-- Anonymous submissions (pending events only), matches events/shop_tags
create policy "Anyone can submit event_sessions for pending events"
  on public.event_sessions for insert
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.status = 'pending'
    )
  );

create policy "Admin all event_sessions"
  on public.event_sessions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.event_sessions (event_id, start_at, end_at)
select id, start_at, end_at
from public.events
where not exists (
  select 1 from public.event_sessions s where s.event_id = events.id
);
