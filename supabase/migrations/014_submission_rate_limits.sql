create table public.submission_rate_limits (
  ip text not null,
  day date not null,
  count integer not null default 0,
  primary key (ip, day)
);

alter table public.submission_rate_limits enable row level security;

-- Only the service role (server API) should touch this table.
create or replace function public.try_consume_submission_rate(
  p_ip text,
  p_day date,
  p_limit integer default 5
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  insert into public.submission_rate_limits (ip, day, count)
  values (p_ip, p_day, 1)
  on conflict (ip, day) do update
  set count = public.submission_rate_limits.count + 1
  returning count into current_count;

  return current_count <= p_limit;
end;
$$;

revoke all on function public.try_consume_submission_rate(text, date, integer) from public;
grant execute on function public.try_consume_submission_rate(text, date, integer) to service_role;
