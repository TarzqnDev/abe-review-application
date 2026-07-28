begin;

lock table public.game_sessions in share row exclusive mode;

create or replace function public.preview_quiz_session(
  selected_area_id bigint,
  selected_game_type text,
  selected_difficulty text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  selected_area_name text;
  selected_timer_seconds smallint;
  available_question_count integer;
begin
  perform public.quiz_reviewee_user_id();

  if selected_game_type = 'PAES' then
    raise exception 'A valid game type and difficulty are required'
      using errcode = '22023';
  end if;

  selected_timer_seconds := public.quiz_timer_seconds(
    selected_game_type,
    selected_difficulty
  );

  if selected_timer_seconds is null then
    raise exception 'A valid game type and difficulty are required'
      using errcode = '22023';
  end if;

  select subject_areas.name
  into selected_area_name
  from public.subject_areas
  where subject_areas.id = selected_area_id;

  if not found then
    raise exception 'A valid subject area is required'
      using errcode = '22023';
  end if;

  select count(*)::integer
  into available_question_count
  from (
    select questions.id
    from public.questions
    join public.question_sets
      on question_sets.id = questions.question_set_id
    join public.subjects
      on subjects.id = question_sets.subject_id
    join public.question_options
      on question_options.question_id = questions.id
    where subjects.area_id = selected_area_id
      and question_sets.game_type = selected_game_type
      and question_sets.difficulty = selected_difficulty
    group by questions.id
    having count(question_options.id) = 4
      and count(question_options.id) filter (
        where question_options.is_correct
      ) = 1
  ) as available_questions;

  if available_question_count = 0 then
    return jsonb_build_object('status', 'empty');
  end if;

  return jsonb_build_object(
    'status', 'available',
    'areaId', selected_area_id,
    'areaName', selected_area_name,
    'gameType', selected_game_type,
    'difficulty', selected_difficulty,
    'timerSeconds', selected_timer_seconds,
    'totalQuestions', available_question_count
  );
end;
$$;

create or replace function public.preview_paes_quiz_session(
  selected_subject_id bigint
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  selected_area_id bigint;
  selected_subject_name text;
  available_question_count integer;
  selected_timer_seconds constant smallint := 60;
begin
  perform public.quiz_reviewee_user_id();

  select
    subject_areas.id,
    subjects.name
  into
    selected_area_id,
    selected_subject_name
  from public.subjects
  join public.subject_areas
    on subject_areas.id = subjects.area_id
  where subjects.id = selected_subject_id
    and subject_areas.name = 'PAES Series';

  if not found then
    raise exception 'A valid PAES subject is required'
      using errcode = '22023';
  end if;

  select count(*)::integer
  into available_question_count
  from (
    select questions.id
    from public.questions
    join public.question_sets
      on question_sets.id = questions.question_set_id
    join public.question_options
      on question_options.question_id = questions.id
    where question_sets.subject_id = selected_subject_id
      and question_sets.game_type = 'PAES'
      and question_sets.difficulty is null
    group by questions.id
    having count(question_options.id) = 4
      and count(question_options.id) filter (
        where question_options.is_correct
      ) = 1
  ) as available_questions;

  if available_question_count = 0 then
    return jsonb_build_object('status', 'empty');
  end if;

  return jsonb_build_object(
    'status', 'available',
    'areaId', selected_area_id,
    'areaName', selected_subject_name,
    'gameType', 'PAES',
    'difficulty', null,
    'timerSeconds', selected_timer_seconds,
    'totalQuestions', available_question_count
  );
end;
$$;

create or replace function public.preview_flash_card_session(
  selected_area_id bigint
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
  selected_deck_id bigint;
  selected_area_name text;
  available_flash_card_count integer;
  selected_timer_seconds constant smallint := 15;
begin
  authenticated_user_id := public.flash_card_reviewee_user_id();

  select
    flash_card_decks.id,
    subject_areas.name
  into
    selected_deck_id,
    selected_area_name
  from public.flash_card_decks
  join public.subject_areas
    on subject_areas.id = flash_card_decks.area_id
  where flash_card_decks.user_id = authenticated_user_id
    and flash_card_decks.area_id = selected_area_id;

  if not found then
    return jsonb_build_object('status', 'empty');
  end if;

  select count(*)::integer
  into available_flash_card_count
  from public.flash_cards
  where flash_cards.deck_id = selected_deck_id;

  if available_flash_card_count = 0 then
    return jsonb_build_object('status', 'empty');
  end if;

  return jsonb_build_object(
    'status', 'available',
    'areaId', selected_area_id,
    'areaName', selected_area_name,
    'timerSeconds', selected_timer_seconds,
    'totalFlashCards', available_flash_card_count
  );
end;
$$;

create or replace function public.start_quiz_session_after_countdown(
  selected_area_id bigint,
  selected_game_type text,
  selected_difficulty text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  prepared_session jsonb;
  started_timing jsonb;
begin
  if selected_game_type = 'PAES' then
    raise exception 'A valid game type and difficulty are required'
      using errcode = '22023';
  end if;

  prepared_session := public.prepare_quiz_session(
    selected_area_id,
    selected_game_type,
    selected_difficulty
  );

  if prepared_session ->> 'status' = 'empty' then
    return jsonb_build_object('status', 'empty');
  end if;

  started_timing := public.start_quiz_session(
    (prepared_session ->> 'sessionId')::uuid
  );

  return jsonb_build_object(
    'status', 'started',
    'preparedSession', prepared_session - 'status',
    'timing', started_timing
  );
end;
$$;

create or replace function public.start_paes_quiz_session_after_countdown(
  selected_subject_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  prepared_session jsonb;
  started_timing jsonb;
begin
  prepared_session := public.prepare_paes_quiz_session(selected_subject_id);

  if prepared_session ->> 'status' = 'empty' then
    return jsonb_build_object('status', 'empty');
  end if;

  started_timing := public.start_quiz_session(
    (prepared_session ->> 'sessionId')::uuid
  );

  return jsonb_build_object(
    'status', 'started',
    'preparedSession', prepared_session - 'status',
    'timing', started_timing
  );
end;
$$;

create or replace function public.start_flash_card_session_after_countdown(
  selected_area_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  prepared_session jsonb;
  started_timing jsonb;
begin
  prepared_session := public.prepare_flash_card_session(selected_area_id);

  if prepared_session ->> 'status' = 'empty' then
    return jsonb_build_object('status', 'empty');
  end if;

  started_timing := public.start_flash_card_session(
    (prepared_session ->> 'sessionId')::uuid
  );

  return jsonb_build_object(
    'status', 'started',
    'preparedSession', prepared_session - 'status',
    'timing', started_timing
  );
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

drop trigger if exists aggregate_reviewee_activity_stats_after_insert
  on public.game_sessions;
create trigger aggregate_reviewee_activity_stats_after_insert
after insert on public.game_sessions
for each row
when (new.status in ('completed', 'exited'))
execute function public.record_reviewee_activity_stats_after_terminal();

drop trigger if exists aggregate_reviewee_activity_stats_after_update
  on public.game_sessions;
create trigger aggregate_reviewee_activity_stats_after_update
after update of status on public.game_sessions
for each row
when (
  old.status not in ('completed', 'exited')
  and new.status in ('completed', 'exited')
)
execute function public.record_reviewee_activity_stats_after_terminal();

create or replace function public.prune_game_session_history()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    20260726,
    pg_catalog.hashtext(new.user_id::text)
  );

  with ranked_sessions as materialized (
    select
      game_sessions.id,
      row_number() over (
        order by
          game_sessions.ended_at desc nulls last,
          game_sessions.id desc
      ) as session_rank
    from public.game_sessions
    where game_sessions.user_id = new.user_id
      and game_sessions.status in ('completed', 'exited')
      and game_sessions.id <> new.id
  )
  delete from public.game_sessions
  using ranked_sessions
  where game_sessions.id = ranked_sessions.id
    and ranked_sessions.session_rank > 19;

  return new;
end;
$$;

drop trigger if exists prune_game_session_history_after_insert
  on public.game_sessions;
create trigger prune_game_session_history_after_insert
after insert on public.game_sessions
for each row
when (new.status in ('completed', 'exited'))
execute function public.prune_game_session_history();

drop trigger if exists prune_game_session_history_after_update
  on public.game_sessions;
create trigger prune_game_session_history_after_update
after update of status on public.game_sessions
for each row
when (
  old.status not in ('completed', 'exited')
  and new.status in ('completed', 'exited')
)
execute function public.prune_game_session_history();

drop index if exists public.game_sessions_user_history_idx;
create index game_sessions_user_history_idx
  on public.game_sessions(user_id, ended_at desc nulls last, id desc)
  where status in ('completed', 'exited');

create or replace function public.get_activity_history_details(
  selected_session_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
  selected_session public.game_sessions%rowtype;
  history_items jsonb;
begin
  authenticated_user_id := auth.uid();

  if authenticated_user_id is null then
    raise exception 'You must be logged in to view activity history'
      using errcode = '42501';
  end if;

  select game_sessions.*
  into selected_session
  from public.game_sessions
  where game_sessions.id = selected_session_id
    and game_sessions.user_id = authenticated_user_id
    and game_sessions.status in ('completed', 'exited');

  if not found then
    raise exception 'Activity history was not found'
      using errcode = 'P0002';
  end if;

  if selected_session.session_type = 'flash_cards' then
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'sessionType', 'flash_cards',
          'id', session_flash_card.id,
          'order', session_flash_card.card_order,
          'prompt', session_flash_card.question_text,
          'submittedAnswer', session_flash_card.submitted_answer,
          'correctAnswer', answer_key.correct_answer,
          'status', session_flash_card.status,
          'result', session_flash_card.result,
          'presentedAt', session_flash_card.presented_at,
          'deadlineAt', session_flash_card.deadline_at,
          'submittedAt', session_flash_card.submitted_at,
          'revealAt', session_flash_card.reveal_at,
          'resolvedAt', session_flash_card.resolved_at,
          'responseTimeMs', session_flash_card.response_time_ms
        )
        order by session_flash_card.card_order
      ),
      '[]'::jsonb
    )
    into history_items
    from public.game_session_flash_cards as session_flash_card
    join public.game_session_flash_card_answer_keys as answer_key
      on answer_key.session_flash_card_id = session_flash_card.id
    where session_flash_card.session_id = selected_session.id;
  else
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'sessionType', 'mcq_quiz',
          'id', session_question.id,
          'order', session_question.question_order,
          'subjectName', session_question.subject_name,
          'prompt', session_question.question_text,
          'options', session_question.options,
          'selectedOption', (
            select quiz_option
            from jsonb_array_elements(session_question.options) as quiz_option
            where (quiz_option ->> 'id')::bigint =
              session_question.selected_option_id
          ),
          'correctOption', (
            select quiz_option
            from jsonb_array_elements(session_question.options) as quiz_option
            where (quiz_option ->> 'id')::bigint =
              answer_key.correct_option_id
          ),
          'status', session_question.status,
          'result', session_question.result,
          'presentedAt', session_question.presented_at,
          'deadlineAt', session_question.deadline_at,
          'submittedAt', session_question.submitted_at,
          'revealAt', session_question.reveal_at,
          'resolvedAt', session_question.resolved_at,
          'responseTimeMs', session_question.response_time_ms
        )
        order by session_question.question_order
      ),
      '[]'::jsonb
    )
    into history_items
    from public.game_session_questions as session_question
    join public.game_session_answer_keys as answer_key
      on answer_key.session_question_id = session_question.id
    where session_question.session_id = selected_session.id;
  end if;

  return jsonb_build_object(
    'gameSessionId', selected_session.id,
    'sessionType', selected_session.session_type,
    'items', history_items
  );
end;
$$;

revoke all on function public.preview_quiz_session(bigint, text, text)
  from public, anon, authenticated;
revoke all on function public.preview_paes_quiz_session(bigint)
  from public, anon, authenticated;
revoke all on function public.preview_flash_card_session(bigint)
  from public, anon, authenticated;
revoke all on function public.start_quiz_session_after_countdown(
  bigint,
  text,
  text
) from public, anon, authenticated;
revoke all on function public.start_paes_quiz_session_after_countdown(bigint)
  from public, anon, authenticated;
revoke all on function public.start_flash_card_session_after_countdown(bigint)
  from public, anon, authenticated;

grant execute on function public.preview_quiz_session(bigint, text, text)
  to authenticated;
grant execute on function public.preview_paes_quiz_session(bigint)
  to authenticated;
grant execute on function public.preview_flash_card_session(bigint)
  to authenticated;
grant execute on function public.start_quiz_session_after_countdown(
  bigint,
  text,
  text
) to authenticated;
grant execute on function public.start_paes_quiz_session_after_countdown(bigint)
  to authenticated;
grant execute on function public.start_flash_card_session_after_countdown(bigint)
  to authenticated;

revoke all on function public.prepare_quiz_session(bigint, text, text)
  from public, anon, authenticated;
revoke all on function public.prepare_paes_quiz_session(bigint)
  from public, anon, authenticated;
revoke all on function public.prepare_flash_card_session(bigint)
  from public, anon, authenticated;
revoke all on function public.start_quiz_session(uuid)
  from public, anon, authenticated;
revoke all on function public.start_flash_card_session(uuid)
  from public, anon, authenticated;
revoke all on function public.cancel_quiz_session(uuid)
  from public, anon, authenticated;
revoke all on function public.cancel_flash_card_session(uuid)
  from public, anon, authenticated;

revoke all on function public.record_reviewee_activity_stats(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.prune_game_session_history()
  from public, anon, authenticated, service_role;
revoke all on function public.get_activity_history_details(uuid)
  from public, anon, authenticated;
grant execute on function public.get_activity_history_details(uuid)
  to authenticated, service_role;

commit;
