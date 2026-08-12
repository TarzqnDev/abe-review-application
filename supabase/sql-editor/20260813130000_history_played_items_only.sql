begin;

lock table public.game_sessions in share row exclusive mode;
lock table public.game_session_questions in share row exclusive mode;
lock table public.game_session_flash_cards in share row exclusive mode;

delete from public.game_session_questions as session_question
using public.game_sessions as session
where session.id = session_question.session_id
  and session.status in ('completed', 'exited')
  and (
    session_question.status not in ('answered', 'timed_out')
    or (
      session_question.status = 'answered'
      and coalesce(session_question.result, '') not in ('correct', 'incorrect')
    )
  );

delete from public.game_session_flash_cards as session_flash_card
using public.game_sessions as session
where session.id = session_flash_card.session_id
  and session.status in ('completed', 'exited')
  and (
    session_flash_card.status not in ('answered', 'timed_out')
    or (
      session_flash_card.status = 'answered'
      and coalesce(session_flash_card.result, '') not in ('correct', 'incorrect')
    )
  );

create or replace function public.exit_quiz_session(
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
  current_question public.game_session_questions%rowtype;
  correct_option_id bigint;
  answer_result text;
  exited_time timestamptz;
begin
  authenticated_user_id := public.quiz_reviewee_user_id();

  select game_sessions.*
  into selected_session
  from public.game_sessions
  where game_sessions.id = selected_session_id
    and game_sessions.user_id = authenticated_user_id
    and game_sessions.session_type = 'mcq_quiz'
  for update;

  if not found then
    raise exception 'Quiz session was not found'
      using errcode = 'P0002';
  end if;

  if selected_session.status in ('completed', 'exited') then
    return public.quiz_session_summary(
      selected_session_id,
      authenticated_user_id
    );
  end if;

  if selected_session.status <> 'in_progress' then
    raise exception 'Quiz session cannot be exited'
      using errcode = '55000';
  end if;

  exited_time := clock_timestamp();

  select game_session_questions.*
  into current_question
  from public.game_session_questions
  where game_session_questions.session_id = selected_session_id
    and game_session_questions.question_order =
      selected_session.current_question_order
  for update;

  if current_question.status = 'submitted' then
    select game_session_answer_keys.correct_option_id
    into correct_option_id
    from public.game_session_answer_keys
    where game_session_answer_keys.session_question_id =
      current_question.id;

    if not found then
      raise exception 'Quiz answer key was not found'
        using errcode = 'P0002';
    end if;

    answer_result := case
      when current_question.selected_option_id = correct_option_id
        then 'correct'
      else 'incorrect'
    end;

    update public.game_session_questions
    set
      status = 'answered',
      result = answer_result,
      resolved_at = exited_time
    where id = current_question.id;
  end if;

  delete from public.game_session_questions
  where session_id = selected_session_id
    and (
      status not in ('answered', 'timed_out')
      or (
        status = 'answered'
        and coalesce(result, '') not in ('correct', 'incorrect')
      )
    );

  update public.game_sessions
  set
    status = 'exited',
    end_reason = 'user_exit',
    ended_at = exited_time
  where id = selected_session_id;

  return public.quiz_session_summary(
    selected_session_id,
    authenticated_user_id
  );
end;
$$;

create or replace function public.exit_flash_card_session(
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
  current_flash_card public.game_session_flash_cards%rowtype;
  correct_answer text;
  answer_result text;
  exited_time timestamptz;
begin
  authenticated_user_id := public.flash_card_reviewee_user_id();

  select game_sessions.*
  into selected_session
  from public.game_sessions
  where game_sessions.id = selected_session_id
    and game_sessions.user_id = authenticated_user_id
    and game_sessions.session_type = 'flash_cards'
  for update;

  if not found then
    raise exception 'Flash card session was not found'
      using errcode = 'P0002';
  end if;

  if selected_session.status in ('completed', 'exited') then
    return public.flash_card_session_summary(
      selected_session_id,
      authenticated_user_id
    );
  end if;

  if selected_session.status <> 'in_progress' then
    raise exception 'Flash card session cannot be exited'
      using errcode = '55000';
  end if;

  exited_time := clock_timestamp();

  select game_session_flash_cards.*
  into current_flash_card
  from public.game_session_flash_cards
  where game_session_flash_cards.session_id = selected_session_id
    and game_session_flash_cards.card_order =
      selected_session.current_question_order
  for update;

  if current_flash_card.status = 'submitted' then
    select game_session_flash_card_answer_keys.correct_answer
    into correct_answer
    from public.game_session_flash_card_answer_keys
    where game_session_flash_card_answer_keys.session_flash_card_id =
      current_flash_card.id;

    if not found then
      raise exception 'Flash card answer key was not found'
        using errcode = 'P0002';
    end if;

    answer_result := case
      when public.normalize_flash_card_answer(
        current_flash_card.submitted_answer
      ) = public.normalize_flash_card_answer(correct_answer)
        then 'correct'
      else 'incorrect'
    end;

    update public.game_session_flash_cards
    set
      status = 'answered',
      result = answer_result,
      resolved_at = exited_time
    where id = current_flash_card.id;
  end if;

  delete from public.game_session_flash_cards
  where session_id = selected_session_id
    and (
      status not in ('answered', 'timed_out')
      or (
        status = 'answered'
        and coalesce(result, '') not in ('correct', 'incorrect')
      )
    );

  update public.game_sessions
  set
    status = 'exited',
    end_reason = 'user_exit',
    ended_at = exited_time
  where id = selected_session_id;

  return public.flash_card_session_summary(
    selected_session_id,
    authenticated_user_id
  );
end;
$$;

create or replace function public.get_activity_history_details_active_internal(
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
          'resolvedAt', session_flash_card.resolved_at
        )
        order by session_flash_card.card_order
      ),
      '[]'::jsonb
    )
    into history_items
    from public.game_session_flash_cards as session_flash_card
    join public.game_session_flash_card_answer_keys as answer_key
      on answer_key.session_flash_card_id = session_flash_card.id
    where session_flash_card.session_id = selected_session.id
      and (
        (
          session_flash_card.status = 'answered'
          and session_flash_card.result in ('correct', 'incorrect')
        )
        or session_flash_card.status = 'timed_out'
      );
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
          'resolvedAt', session_question.resolved_at
        )
        order by session_question.question_order
      ),
      '[]'::jsonb
    )
    into history_items
    from public.game_session_questions as session_question
    join public.game_session_answer_keys as answer_key
      on answer_key.session_question_id = session_question.id
    where session_question.session_id = selected_session.id
      and (
        (
          session_question.status = 'answered'
          and session_question.result in ('correct', 'incorrect')
        )
        or session_question.status = 'timed_out'
      );
  end if;

  return jsonb_build_object(
    'gameSessionId', selected_session.id,
    'sessionType', selected_session.session_type,
    'items', history_items
  );
end;
$$;

revoke all on function public.exit_quiz_session(uuid)
  from public, anon;
revoke all on function public.exit_flash_card_session(uuid)
  from public, anon;
revoke all on function public.get_activity_history_details_active_internal(uuid)
  from public, anon, authenticated;

grant execute on function public.exit_quiz_session(uuid)
  to authenticated;
grant execute on function public.exit_flash_card_session(uuid)
  to authenticated;

commit;
