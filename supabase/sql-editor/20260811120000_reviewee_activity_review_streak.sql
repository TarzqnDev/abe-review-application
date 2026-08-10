lock table public.game_sessions in share row exclusive mode;
lock table public.reviewee_activity_stats in share row exclusive mode;

alter table public.reviewee_activity_stats
  add column if not exists review_streak_days bigint not null default 0,
  add column if not exists last_review_activity_date date;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reviewee_activity_stats_review_streak_check'
      and conrelid = 'public.reviewee_activity_stats'::regclass
  ) then
    alter table public.reviewee_activity_stats
      add constraint reviewee_activity_stats_review_streak_check
      check (
        review_streak_days >= 0
        and (
          review_streak_days = 0
          or last_review_activity_date is not null
        )
      );
  end if;
end;
$$;

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
  review_activity_date date;
begin
  select game_sessions.*
  into selected_session
  from public.game_sessions
  where game_sessions.id = selected_session_id
  for update;

  if not found
    or selected_session.status not in ('completed', 'exited')
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
      count(*) filter (
        where game_session_flash_cards.result = 'correct'
      )::bigint,
      count(*) filter (
        where game_session_flash_cards.result in ('correct', 'incorrect')
      )::bigint
    into correct_count, answered_count
    from public.game_session_flash_cards
    where game_session_flash_cards.session_id = selected_session.id;
  else
    select
      count(*) filter (
        where game_session_questions.result = 'correct'
      )::bigint,
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

  review_activity_date := (
    coalesce(
      selected_session.ended_at,
      selected_session.started_at,
      selected_session.prepared_at
    ) at time zone 'Asia/Manila'
  )::date;

  insert into public.reviewee_activity_stats (
    user_id,
    total_sessions,
    completed_sessions,
    review_streak_days,
    last_review_activity_date,
    total_correct_answers,
    total_answered_items,
    total_study_seconds,
    updated_at
  )
  values (
    selected_session.user_id,
    1,
    case when selected_session.status = 'completed' then 1 else 0 end,
    1,
    review_activity_date,
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
    review_streak_days =
      case
        when excluded.last_review_activity_date is null then
          reviewee_activity_stats.review_streak_days
        when reviewee_activity_stats.last_review_activity_date is null then 1
        when excluded.last_review_activity_date =
          reviewee_activity_stats.last_review_activity_date then
          reviewee_activity_stats.review_streak_days
        when excluded.last_review_activity_date =
          reviewee_activity_stats.last_review_activity_date + 1 then
          reviewee_activity_stats.review_streak_days + 1
        when excluded.last_review_activity_date >
          reviewee_activity_stats.last_review_activity_date then 1
        else reviewee_activity_stats.review_streak_days
      end,
    last_review_activity_date =
      greatest(
        reviewee_activity_stats.last_review_activity_date,
        excluded.last_review_activity_date
      ),
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

with user_activity_dates as (
  select distinct
    game_sessions.user_id,
    (
      coalesce(
        game_sessions.ended_at,
        game_sessions.started_at,
        game_sessions.prepared_at
      ) at time zone 'Asia/Manila'
    )::date as activity_date
  from public.game_sessions
  where game_sessions.status in ('completed', 'exited')
),
ordered_activity_dates as (
  select
    user_activity_dates.user_id,
    user_activity_dates.activity_date,
    max(user_activity_dates.activity_date) over (
      partition by user_activity_dates.user_id
    ) as latest_activity_date,
    row_number() over (
      partition by user_activity_dates.user_id
      order by user_activity_dates.activity_date desc
    ) as activity_date_rank
  from user_activity_dates
),
review_streaks as (
  select
    ordered_activity_dates.user_id,
    ordered_activity_dates.latest_activity_date,
    count(*) filter (
      where ordered_activity_dates.activity_date =
        ordered_activity_dates.latest_activity_date
        - (ordered_activity_dates.activity_date_rank::integer - 1)
    )::bigint as review_streak_days
  from ordered_activity_dates
  group by
    ordered_activity_dates.user_id,
    ordered_activity_dates.latest_activity_date
)
update public.reviewee_activity_stats
set
  review_streak_days = review_streaks.review_streak_days,
  last_review_activity_date = review_streaks.latest_activity_date,
  updated_at = timezone('utc'::text, now())
from review_streaks
where reviewee_activity_stats.user_id = review_streaks.user_id;

revoke all on function public.record_reviewee_activity_stats(uuid)
  from public, anon, authenticated;
grant execute on function public.record_reviewee_activity_stats(uuid)
  to service_role;
