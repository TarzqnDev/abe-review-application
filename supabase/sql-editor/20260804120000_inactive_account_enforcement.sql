begin;

create or replace function public.is_current_user_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where users.user_id = (select auth.uid())
      and pg_catalog.lower(users.status) = 'active'
  );
$$;

revoke all on function public.is_current_user_active()
  from public, anon;
grant execute on function public.is_current_user_active()
  to authenticated, service_role;

create or replace function public.get_user_roles(uid uuid)
returns text[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(roles.name), array[]::text[])
  from public.user_roles
  join public.roles on roles.id = user_roles.role_id
  join public.users on users.user_id = user_roles.user_id
  where user_roles.user_id = uid
    and pg_catalog.lower(users.status) = 'active';
$$;

revoke all on function public.get_user_roles(uuid)
  from public, anon;
grant execute on function public.get_user_roles(uuid)
  to authenticated, service_role;

alter table public.users
  drop constraint if exists users_status_check;
alter table public.users
  add constraint users_status_check check (
    pg_catalog.lower(status) in ('active', 'inactive', 'pending')
  );

revoke all on table public.users from anon;
revoke all on table public.user_roles from anon;
revoke all on table public.payments from anon;

drop policy if exists "Enable select for authenticated users only"
  on public.users;
drop policy if exists "Users can view their profile and active admins can view users"
  on public.users;
create policy "Users can view their profile and active admins can view users"
on public.users
for select
to authenticated
using (
  user_id = (select auth.uid())
  or 'admin' = any(public.get_user_roles((select auth.uid())))
);

drop policy if exists "Enable update for authenticated users only"
  on public.users;
drop policy if exists "Active admins can update users"
  on public.users;
create policy "Active admins can update users"
on public.users
for update
to authenticated
using (
  'admin' = any(public.get_user_roles((select auth.uid())))
)
with check (
  'admin' = any(public.get_user_roles((select auth.uid())))
);

drop policy if exists "Enable insert for authenticated users only"
  on public.user_roles;
drop policy if exists "Enable read access for all users"
  on public.user_roles;
drop policy if exists "Enable update for authenticated users only"
  on public.user_roles;
drop policy if exists "Active admins can insert user roles"
  on public.user_roles;
drop policy if exists "Active admins can update user roles"
  on public.user_roles;
drop policy if exists "Users can view their role and active admins can view roles"
  on public.user_roles;
create policy "Users can view their role and active admins can view roles"
on public.user_roles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or 'admin' = any(public.get_user_roles((select auth.uid())))
);
create policy "Active admins can insert user roles"
on public.user_roles
for insert
to authenticated
with check (
  'admin' = any(public.get_user_roles((select auth.uid())))
);
create policy "Active admins can update user roles"
on public.user_roles
for update
to authenticated
using (
  'admin' = any(public.get_user_roles((select auth.uid())))
)
with check (
  'admin' = any(public.get_user_roles((select auth.uid())))
);

drop policy if exists "Admins can view payments" on public.payments;
drop policy if exists "Active admins can view payments" on public.payments;
create policy "Active admins can view payments"
on public.payments
for select
to authenticated
using (
  'admin' = any(public.get_user_roles((select auth.uid())))
);

do $$
declare
  protected_table text;
begin
  foreach protected_table in array array[
    'flash_card_decks',
    'flash_cards',
    'game_session_answer_keys',
    'game_session_flash_card_answer_keys',
    'game_session_flash_cards',
    'game_session_questions',
    'game_sessions',
    'payments',
    'permissions',
    'question_options',
    'question_sets',
    'questions',
    'reviewee_activity_stats',
    'reviewee_invitation_email_logs',
    'role_permissions',
    'subject_areas',
    'subjects',
    'trivias'
  ]
  loop
    execute format(
      'drop policy if exists "Active accounts only" on public.%I',
      protected_table
    );
    execute format(
      'create policy "Active accounts only" on public.%I as restrictive for all to authenticated using (public.is_current_user_active()) with check (public.is_current_user_active())',
      protected_table
    );
  end loop;
end;
$$;

create or replace function public.quiz_reviewee_user_id()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
begin
  authenticated_user_id := auth.uid();

  if authenticated_user_id is null then
    raise exception 'You must be logged in to play a quiz'
      using errcode = '42501';
  end if;

  if not public.is_current_user_active() then
    raise exception 'Your account has been deactivated'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.user_roles
    join public.roles on roles.id = user_roles.role_id
    where user_roles.user_id = authenticated_user_id
      and roles.name = 'reviewee'
  ) then
    raise exception 'You are not authorized to play a quiz'
      using errcode = '42501';
  end if;

  return authenticated_user_id;
end;
$$;

create or replace function public.flash_card_reviewee_user_id()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid;
begin
  authenticated_user_id := auth.uid();

  if authenticated_user_id is null then
    raise exception 'You must be logged in to play flash cards'
      using errcode = '42501';
  end if;

  if not public.is_current_user_active() then
    raise exception 'Your account has been deactivated'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.user_roles
    join public.roles on roles.id = user_roles.role_id
    where user_roles.user_id = authenticated_user_id
      and roles.name = 'reviewee'
  ) then
    raise exception 'You are not authorized to play flash cards'
      using errcode = '42501';
  end if;

  return authenticated_user_id;
end;
$$;

do $$
begin
  if to_regprocedure(
    'public.get_activity_history_details_active_internal(uuid)'
  ) is null then
    alter function public.get_activity_history_details(uuid)
      rename to get_activity_history_details_active_internal;
  end if;
end;
$$;

revoke all on function public.get_activity_history_details_active_internal(uuid)
  from public, anon, authenticated;

create or replace function public.get_activity_history_details(
  selected_session_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be logged in to view activity history'
      using errcode = '42501';
  end if;

  if not public.is_current_user_active() then
    raise exception 'Your account has been deactivated'
      using errcode = '42501';
  end if;

  return public.get_activity_history_details_active_internal(
    selected_session_id
  );
end;
$$;

revoke all on function public.get_activity_history_details(uuid)
  from public, anon;
grant execute on function public.get_activity_history_details(uuid)
  to authenticated, service_role;

commit;
