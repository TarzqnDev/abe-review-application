begin;

create or replace function public.submit_quiz_answer(
  selected_session_question_id bigint,
  selected_option_id bigint,
  client_submitted_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
  selected_session public.game_sessions%rowtype;
  selected_question public.game_session_questions%rowtype;
  received_time timestamptz;
  submitted_time timestamptz;
  answer_reveal_time timestamptz;
begin
  authenticated_user_id := public.quiz_reviewee_user_id();

  select game_sessions.*
  into selected_session
  from public.game_sessions
  join public.game_session_questions
    on game_session_questions.session_id = game_sessions.id
  where game_session_questions.id = selected_session_question_id
    and game_sessions.user_id = authenticated_user_id
  for update of game_sessions;

  if not found then
    raise exception 'Quiz question was not found'
      using errcode = 'P0002';
  end if;

  select game_session_questions.*
  into selected_question
  from public.game_session_questions
  where game_session_questions.id = selected_session_question_id
  for update;

  if selected_session.status <> 'in_progress'
    or selected_session.current_question_order <> selected_question.question_order
    or selected_question.status <> 'active'
  then
    raise exception 'Quiz question is not accepting answers'
      using errcode = '55000';
  end if;

  received_time := clock_timestamp();
  submitted_time := client_submitted_at;

  if submitted_time is null
    or submitted_time < selected_question.presented_at
    or submitted_time > received_time + interval '2 seconds'
    or received_time > selected_question.deadline_at + interval '2 minutes'
  then
    raise exception 'The answer submission time is invalid'
      using errcode = '22023';
  end if;

  if selected_question.deadline_at is null
    or submitted_time > selected_question.deadline_at
  then
    raise exception 'The answer deadline has passed'
      using errcode = '57014';
  end if;

  if not exists (
    select 1
    from jsonb_array_elements(selected_question.options) as quiz_option
    where (quiz_option->>'id')::bigint = selected_option_id
  ) then
    raise exception 'The selected answer is invalid'
      using errcode = '22023';
  end if;

  answer_reveal_time := submitted_time;

  update public.game_session_questions
  set
    status = 'submitted',
    selected_option_id = $2,
    submitted_at = submitted_time,
    reveal_at = answer_reveal_time,
    response_time_ms = greatest(
      0,
      floor(
        extract(epoch from (submitted_time - selected_question.presented_at))
        * 1000
      )::integer
    )
  where id = selected_session_question_id;

  return jsonb_build_object(
    'sessionQuestionId', selected_session_question_id,
    'status', 'submitted',
    'submittedAt', submitted_time,
    'revealAt', answer_reveal_time
  );
end;
$$;

create or replace function public.submit_flash_card_answer(
  selected_session_flash_card_id bigint,
  selected_answer text,
  client_submitted_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
  selected_session public.game_sessions%rowtype;
  selected_flash_card public.game_session_flash_cards%rowtype;
  received_time timestamptz;
  submitted_time timestamptz;
  answer_reveal_time timestamptz;
begin
  authenticated_user_id := public.flash_card_reviewee_user_id();

  if selected_answer is null
    or char_length(btrim(selected_answer)) not between 1 and 2000
  then
    raise exception 'A valid answer is required'
      using errcode = '22023';
  end if;

  select game_sessions.*
  into selected_session
  from public.game_sessions
  join public.game_session_flash_cards
    on game_session_flash_cards.session_id = game_sessions.id
  where game_session_flash_cards.id = selected_session_flash_card_id
    and game_sessions.user_id = authenticated_user_id
    and game_sessions.session_type = 'flash_cards'
  for update of game_sessions;

  if not found then
    raise exception 'Flash card was not found'
      using errcode = 'P0002';
  end if;

  select game_session_flash_cards.*
  into selected_flash_card
  from public.game_session_flash_cards
  where game_session_flash_cards.id = selected_session_flash_card_id
  for update;

  if selected_session.status <> 'in_progress'
    or selected_session.current_question_order <> selected_flash_card.card_order
    or selected_flash_card.status <> 'active'
  then
    raise exception 'Flash card is not accepting answers'
      using errcode = '55000';
  end if;

  received_time := clock_timestamp();
  submitted_time := client_submitted_at;

  if submitted_time is null
    or submitted_time < selected_flash_card.presented_at
    or submitted_time > received_time + interval '2 seconds'
    or received_time > selected_flash_card.deadline_at + interval '2 minutes'
  then
    raise exception 'The answer submission time is invalid'
      using errcode = '22023';
  end if;

  if selected_flash_card.deadline_at is null
    or submitted_time > selected_flash_card.deadline_at
  then
    raise exception 'The answer deadline has passed'
      using errcode = '57014';
  end if;

  answer_reveal_time := submitted_time;

  update public.game_session_flash_cards
  set
    status = 'submitted',
    submitted_answer = btrim(selected_answer),
    submitted_at = submitted_time,
    reveal_at = answer_reveal_time,
    response_time_ms = greatest(
      0,
      floor(
        extract(epoch from (submitted_time - selected_flash_card.presented_at))
        * 1000
      )::integer
    )
  where id = selected_session_flash_card_id;

  return jsonb_build_object(
    'sessionFlashCardId', selected_session_flash_card_id,
    'status', 'submitted',
    'submittedAt', submitted_time,
    'revealAt', answer_reveal_time
  );
end;
$$;

revoke all on function public.submit_quiz_answer(bigint, bigint, timestamptz)
  from public, anon;
revoke all on function public.submit_flash_card_answer(bigint, text, timestamptz)
  from public, anon;

grant execute on function public.submit_quiz_answer(bigint, bigint, timestamptz)
  to authenticated;
grant execute on function public.submit_flash_card_answer(bigint, text, timestamptz)
  to authenticated;

commit;
