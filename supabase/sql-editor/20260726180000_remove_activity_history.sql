begin;

drop trigger if exists sync_activity_history on public.game_sessions;

drop function if exists public.sync_activity_history();
drop function if exists public.sync_activity_history_session(uuid);
drop function if exists public.get_activity_history_details(bigint);

drop table if exists public.activity_history;

drop index if exists public.game_sessions_user_history_idx;
create index game_sessions_user_history_idx
  on public.game_sessions(user_id, ended_at desc nulls last, id desc)
  where status in ('completed', 'exited', 'cancelled');

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
    and game_sessions.status in ('completed', 'exited', 'cancelled');

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

revoke all on function public.get_activity_history_details(uuid)
  from public, anon, authenticated;
grant execute on function public.get_activity_history_details(uuid)
  to authenticated, service_role;

commit;
