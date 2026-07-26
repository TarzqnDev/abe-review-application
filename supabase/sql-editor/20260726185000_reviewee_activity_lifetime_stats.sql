begin;

lock table public.game_sessions in share row exclusive mode;

alter table public.game_sessions
  add column if not exists activity_stats_recorded_at timestamptz;

create table if not exists public.reviewee_activity_stats (
  user_id uuid primary key references public.users(user_id) on delete cascade,
  total_sessions bigint not null default 0,
  completed_sessions bigint not null default 0,
  total_correct_answers bigint not null default 0,
  total_answered_items bigint not null default 0,
  total_study_seconds bigint not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint reviewee_activity_stats_counts_check check (
    total_sessions >= 0
    and completed_sessions >= 0
    and completed_sessions <= total_sessions
    and total_correct_answers >= 0
    and total_answered_items >= 0
    and total_correct_answers <= total_answered_items
    and total_study_seconds >= 0
  )
);

alter table public.reviewee_activity_stats enable row level security;

drop policy if exists "Reviewees can view their own activity stats"
  on public.reviewee_activity_stats;
create policy "Reviewees can view their own activity stats"
on public.reviewee_activity_stats
for select
to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.user_roles
    join public.roles
      on roles.id = user_roles.role_id
    where user_roles.user_id = (select auth.uid())
      and roles.name = 'reviewee'
  )
);

revoke all on table public.reviewee_activity_stats
  from public, anon, authenticated;
grant select on table public.reviewee_activity_stats to authenticated;
grant all on table public.reviewee_activity_stats to service_role;

drop trigger if exists aggregate_reviewee_activity_stats_after_insert
  on public.game_sessions;
drop trigger if exists aggregate_reviewee_activity_stats_after_update
  on public.game_sessions;
drop function if exists public.record_reviewee_activity_stats();

create or replace function public.record_reviewee_activity_stats(
  selected_session_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_session public.game_sessions%rowtype;
  correct_count bigint := 0;
  answered_count bigint := 0;
  duration_seconds bigint := 0;
begin
  select game_sessions.*
  into selected_session
  from public.game_sessions
  where game_sessions.id = selected_session_id
  for update;

  if not found
    or selected_session.status not in ('completed', 'exited', 'cancelled')
    or selected_session.activity_stats_recorded_at is not null
  then
    return;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    2026072618,
    pg_catalog.hashtext(selected_session.user_id::text)
  );

  select game_sessions.*
  into selected_session
  from public.game_sessions
  where game_sessions.id = selected_session_id
  for update;

  if selected_session.activity_stats_recorded_at is not null then
    return;
  end if;

  if selected_session.session_type = 'flash_cards' then
    select
      count(*) filter (where game_session_flash_cards.result = 'correct')::bigint,
      count(*) filter (
        where game_session_flash_cards.result in ('correct', 'incorrect')
      )::bigint
    into correct_count, answered_count
    from public.game_session_flash_cards
    where game_session_flash_cards.session_id = selected_session.id;
  else
    select
      count(*) filter (where game_session_questions.result = 'correct')::bigint,
      count(*) filter (
        where game_session_questions.result in ('correct', 'incorrect')
      )::bigint
    into correct_count, answered_count
    from public.game_session_questions
    where game_session_questions.session_id = selected_session.id;
  end if;

  if selected_session.started_at is not null then
    duration_seconds := greatest(
      0,
      floor(
        extract(
          epoch from (
            coalesce(selected_session.ended_at, selected_session.started_at)
            - selected_session.started_at
          )
        )
      )::bigint
    );
  end if;

  insert into public.reviewee_activity_stats (
    user_id,
    total_sessions,
    completed_sessions,
    total_correct_answers,
    total_answered_items,
    total_study_seconds,
    updated_at
  )
  values (
    selected_session.user_id,
    1,
    case when selected_session.status = 'completed' then 1 else 0 end,
    correct_count,
    answered_count,
    duration_seconds,
    timezone('utc'::text, now())
  )
  on conflict (user_id) do update
  set
    total_sessions =
      reviewee_activity_stats.total_sessions + excluded.total_sessions,
    completed_sessions =
      reviewee_activity_stats.completed_sessions
      + excluded.completed_sessions,
    total_correct_answers =
      reviewee_activity_stats.total_correct_answers
      + excluded.total_correct_answers,
    total_answered_items =
      reviewee_activity_stats.total_answered_items
      + excluded.total_answered_items,
    total_study_seconds =
      reviewee_activity_stats.total_study_seconds
      + excluded.total_study_seconds,
    updated_at = excluded.updated_at;

  update public.game_sessions
  set activity_stats_recorded_at = timezone('utc'::text, now())
  where game_sessions.id = selected_session.id
    and game_sessions.activity_stats_recorded_at is null;
end;
$$;

create or replace function public.record_reviewee_activity_stats_after_terminal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.record_reviewee_activity_stats(new.id);
  return new;
end;
$$;

revoke all on function public.record_reviewee_activity_stats(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.record_reviewee_activity_stats_after_terminal()
  from public, anon, authenticated, service_role;

create trigger aggregate_reviewee_activity_stats_after_insert
after insert on public.game_sessions
for each row
when (new.status in ('completed', 'exited', 'cancelled'))
execute function public.record_reviewee_activity_stats_after_terminal();

create trigger aggregate_reviewee_activity_stats_after_update
after update of status on public.game_sessions
for each row
when (
  old.status not in ('completed', 'exited', 'cancelled')
  and new.status in ('completed', 'exited', 'cancelled')
)
execute function public.record_reviewee_activity_stats_after_terminal();

with terminal_sessions as materialized (
  select game_sessions.id
  from public.game_sessions
  where game_sessions.status in ('completed', 'exited', 'cancelled')
    and game_sessions.activity_stats_recorded_at is null
  order by game_sessions.ended_at nulls last, game_sessions.id
)
select public.record_reviewee_activity_stats(terminal_sessions.id)
from terminal_sessions;

commit;
