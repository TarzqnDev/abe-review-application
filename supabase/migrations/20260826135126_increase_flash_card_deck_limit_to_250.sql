create or replace function public.enforce_flash_card_deck_limit()
  returns trigger
  language plpgsql
  security definer
  set search_path to ''
as $function$
begin
  if tg_op = 'UPDATE' then
    if new.deck_id = old.deck_id then
      return new;
    end if;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(new.deck_id);

  if (
    select count(*)
    from public.flash_cards
    where flash_cards.deck_id = new.deck_id
  ) >= 250 then
    raise exception 'Flash card decks can contain no more than 250 cards'
      using errcode = '23514';
  end if;

  return new;
end;
$function$;
