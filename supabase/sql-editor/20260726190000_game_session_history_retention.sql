begin;

lock table public.game_sessions in share row exclusive mode;

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
      and game_sessions.status in ('completed', 'exited', 'cancelled')
      and game_sessions.id <> new.id
  )
  delete from public.game_sessions
  using ranked_sessions
  where game_sessions.id = ranked_sessions.id
    and ranked_sessions.session_rank > 19;

  return new;
end;
$$;

revoke all on function public.prune_game_session_history()
  from public, anon, authenticated, service_role;

drop trigger if exists prune_game_session_history_after_insert
  on public.game_sessions;
create trigger prune_game_session_history_after_insert
after insert on public.game_sessions
for each row
when (new.status in ('completed', 'exited', 'cancelled'))
execute function public.prune_game_session_history();

drop trigger if exists prune_game_session_history_after_update
  on public.game_sessions;
create trigger prune_game_session_history_after_update
after update of status on public.game_sessions
for each row
when (
  old.status not in ('completed', 'exited', 'cancelled')
  and new.status in ('completed', 'exited', 'cancelled')
)
execute function public.prune_game_session_history();

with ranked_sessions as materialized (
  select
    game_sessions.id,
    row_number() over (
      partition by game_sessions.user_id
      order by
        game_sessions.ended_at desc nulls last,
        game_sessions.id desc
    ) as session_rank
  from public.game_sessions
  where game_sessions.status in ('completed', 'exited', 'cancelled')
)
delete from public.game_sessions
using ranked_sessions
where game_sessions.id = ranked_sessions.id
  and ranked_sessions.session_rank > 20;

commit;
