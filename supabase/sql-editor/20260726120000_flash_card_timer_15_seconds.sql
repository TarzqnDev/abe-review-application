begin;

alter table public.game_sessions
  drop constraint if exists game_sessions_flash_card_timer_check;

alter table public.game_sessions
  add constraint game_sessions_flash_card_timer_check check (
    session_type <> 'flash_cards'
    or timer_seconds in (10, 15)
  );

create or replace function public.prepare_flash_card_session(
  selected_area_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
  selected_deck public.flash_card_decks%rowtype;
  selected_area_name text;
  created_session_id uuid;
  created_session_flash_card_id bigint;
  flash_card_number integer := 0;
  selected_flash_card record;
  prepared_flash_cards jsonb;
  selected_timer_seconds constant smallint := 15;
begin
  authenticated_user_id := public.flash_card_reviewee_user_id();

  select flash_card_decks.*
  into selected_deck
  from public.flash_card_decks
  where flash_card_decks.user_id = authenticated_user_id
    and flash_card_decks.area_id = selected_area_id;

  if not found then
    return jsonb_build_object('status', 'empty');
  end if;

  select subject_areas.name
  into selected_area_name
  from public.subject_areas
  where subject_areas.id = selected_area_id;

  if not found then
    raise exception 'A valid subject area is required'
      using errcode = '22023';
  end if;

  insert into public.game_sessions (
    user_id,
    area_id,
    area_name,
    session_type,
    flash_card_deck_id,
    game_type,
    difficulty,
    timer_seconds
  )
  values (
    authenticated_user_id,
    selected_area_id,
    selected_area_name,
    'flash_cards',
    selected_deck.id,
    'Flash Cards',
    null,
    selected_timer_seconds
  )
  returning id into created_session_id;

  for selected_flash_card in
    select
      flash_cards.id,
      flash_cards.question,
      flash_cards.answer
    from public.flash_cards
    where flash_cards.deck_id = selected_deck.id
    order by random()
  loop
    flash_card_number := flash_card_number + 1;

    insert into public.game_session_flash_cards (
      session_id,
      flash_card_id,
      question_text,
      card_order
    )
    values (
      created_session_id,
      selected_flash_card.id,
      selected_flash_card.question,
      flash_card_number
    )
    returning id into created_session_flash_card_id;

    insert into public.game_session_flash_card_answer_keys (
      session_flash_card_id,
      correct_answer
    )
    values (
      created_session_flash_card_id,
      selected_flash_card.answer
    );
  end loop;

  if flash_card_number = 0 then
    delete from public.game_sessions
    where id = created_session_id;

    return jsonb_build_object('status', 'empty');
  end if;

  update public.game_sessions
  set total_questions = flash_card_number
  where id = created_session_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'sessionFlashCardId', game_session_flash_cards.id,
        'cardOrder', game_session_flash_cards.card_order,
        'questionText', game_session_flash_cards.question_text
      )
      order by game_session_flash_cards.card_order
    ),
    '[]'::jsonb
  )
  into prepared_flash_cards
  from public.game_session_flash_cards
  where game_session_flash_cards.session_id = created_session_id;

  return jsonb_build_object(
    'status', 'prepared',
    'sessionId', created_session_id,
    'areaId', selected_area_id,
    'areaName', selected_area_name,
    'timerSeconds', selected_timer_seconds,
    'totalFlashCards', flash_card_number,
    'flashCards', prepared_flash_cards
  );
end;
$$;

revoke all on function public.prepare_flash_card_session(bigint)
  from public, anon;
grant execute on function public.prepare_flash_card_session(bigint)
  to authenticated;

commit;
