begin;

create table if not exists public.quiz_timer_configurations (
  game_type text not null,
  difficulty text,
  timer_seconds smallint not null,
  constraint quiz_timer_configurations_game_type_check check (
    game_type in ('Guess the Word', 'AB-Solution', 'Situationship', 'PAES')
  ),
  constraint quiz_timer_configurations_difficulty_check check (
    (game_type = 'PAES' and difficulty is null)
    or (
      game_type in ('Guess the Word', 'AB-Solution', 'Situationship')
      and difficulty in ('Easy', 'Medium', 'Hard')
    )
  ),
  constraint quiz_timer_configurations_timer_seconds_check check (
    timer_seconds > 0
  )
);

create unique index if not exists quiz_timer_configurations_game_type_difficulty_key
  on public.quiz_timer_configurations (
    game_type,
    coalesce(difficulty, '')
  );

alter table public.quiz_timer_configurations enable row level security;

revoke all on table public.quiz_timer_configurations from public, anon, authenticated;

insert into public.quiz_timer_configurations (
  game_type,
  difficulty,
  timer_seconds
)
values
  ('Guess the Word', 'Easy', 30),
  ('Guess the Word', 'Medium', 40),
  ('Guess the Word', 'Hard', 90),
  ('AB-Solution', 'Easy', 30),
  ('AB-Solution', 'Medium', 40),
  ('AB-Solution', 'Hard', 90),
  ('Situationship', 'Easy', 30),
  ('Situationship', 'Medium', 40),
  ('Situationship', 'Hard', 90),
  ('PAES', null, 15)
on conflict (game_type, (coalesce(difficulty, '')))
do update set timer_seconds = excluded.timer_seconds;

alter table public.game_sessions
  drop constraint if exists game_sessions_paes_timer_check;

create or replace function public.quiz_timer_seconds(
  selected_game_type text,
  selected_difficulty text
)
returns smallint
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  configured_timer_seconds smallint;
begin
  select quiz_timer_configurations.timer_seconds
  into configured_timer_seconds
  from public.quiz_timer_configurations
  where quiz_timer_configurations.game_type = selected_game_type
    and quiz_timer_configurations.difficulty is not distinct from selected_difficulty;

  return configured_timer_seconds;
end;
$$;

create or replace function public.prepare_paes_quiz_session(
  selected_subject_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
  selected_area_id bigint;
  selected_subject_name text;
  selected_timer_seconds smallint;
  created_session_id uuid;
  created_session_question_id bigint;
  question_number integer := 0;
  selected_question record;
  prepared_questions jsonb;
begin
  authenticated_user_id := public.quiz_reviewee_user_id();
  selected_timer_seconds := public.quiz_timer_seconds('PAES', null);

  if selected_timer_seconds is null then
    raise exception 'A PAES timer configuration is required'
      using errcode = '22023';
  end if;

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

  insert into public.game_sessions (
    user_id,
    area_id,
    area_name,
    game_type,
    difficulty,
    timer_seconds
  )
  values (
    authenticated_user_id,
    selected_area_id,
    selected_subject_name,
    'PAES',
    null,
    selected_timer_seconds
  )
  returning id into created_session_id;

  for selected_question in
    select
      questions.id as question_id,
      questions.question_set_id,
      question_sets.subject_id,
      subjects.name as subject_name,
      questions.question_text,
      jsonb_agg(
        jsonb_build_object(
          'id', question_options.id,
          'text', question_options.option_text,
          'sortOrder', question_options.sort_order
        )
        order by question_options.sort_order
      ) as options,
      max(question_options.id) filter (
        where question_options.is_correct
      ) as correct_option_id
    from public.questions
    join public.question_sets
      on question_sets.id = questions.question_set_id
    join public.subjects
      on subjects.id = question_sets.subject_id
    join public.question_options
      on question_options.question_id = questions.id
    where question_sets.subject_id = selected_subject_id
      and question_sets.game_type = 'PAES'
      and question_sets.difficulty is null
    group by
      questions.id,
      questions.question_set_id,
      question_sets.subject_id,
      subjects.name,
      questions.question_text
    having count(question_options.id) = 4
      and count(question_options.id) filter (
        where question_options.is_correct
      ) = 1
    order by random()
  loop
    question_number := question_number + 1;

    insert into public.game_session_questions (
      session_id,
      question_id,
      question_set_id,
      subject_id,
      subject_name,
      question_text,
      options,
      question_order
    )
    values (
      created_session_id,
      selected_question.question_id,
      selected_question.question_set_id,
      selected_question.subject_id,
      selected_question.subject_name,
      selected_question.question_text,
      selected_question.options,
      question_number
    )
    returning id into created_session_question_id;

    insert into public.game_session_answer_keys (
      session_question_id,
      correct_option_id
    )
    values (
      created_session_question_id,
      selected_question.correct_option_id
    );
  end loop;

  if question_number = 0 then
    delete from public.game_sessions
    where id = created_session_id;

    return jsonb_build_object('status', 'empty');
  end if;

  update public.game_sessions
  set total_questions = question_number
  where id = created_session_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'sessionQuestionId', game_session_questions.id,
        'questionOrder', game_session_questions.question_order,
        'subjectName', game_session_questions.subject_name,
        'questionText', game_session_questions.question_text,
        'options', game_session_questions.options
      )
      order by game_session_questions.question_order
    ),
    '[]'::jsonb
  )
  into prepared_questions
  from public.game_session_questions
  where game_session_questions.session_id = created_session_id;

  return jsonb_build_object(
    'status', 'prepared',
    'sessionId', created_session_id,
    'areaId', selected_area_id,
    'areaName', selected_subject_name,
    'gameType', 'PAES',
    'difficulty', null,
    'timerSeconds', selected_timer_seconds,
    'totalQuestions', question_number,
    'questions', prepared_questions
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
  selected_timer_seconds smallint;
begin
  perform public.quiz_reviewee_user_id();
  selected_timer_seconds := public.quiz_timer_seconds('PAES', null);

  if selected_timer_seconds is null then
    raise exception 'A PAES timer configuration is required'
      using errcode = '22023';
  end if;

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

revoke all on function public.quiz_timer_seconds(text, text)
  from public, anon, authenticated;
revoke all on function public.prepare_paes_quiz_session(bigint)
  from public, anon, authenticated;
revoke all on function public.preview_paes_quiz_session(bigint)
  from public, anon, authenticated;

grant execute on function public.preview_paes_quiz_session(bigint)
  to authenticated;

commit;
