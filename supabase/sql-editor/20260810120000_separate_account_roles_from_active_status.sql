begin;

create or replace function public.get_user_roles(uid uuid)
returns text[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(roles.name order by roles.name), array[]::text[])
  from public.user_roles
  join public.roles on roles.id = user_roles.role_id
  where user_roles.user_id = uid;
$$;

revoke all on function public.get_user_roles(uuid)
  from public, anon;
grant execute on function public.get_user_roles(uuid)
  to authenticated, service_role;

create or replace function public.is_current_user_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    join public.user_roles on user_roles.user_id = users.user_id
    join public.roles on roles.id = user_roles.role_id
    where users.user_id = (select auth.uid())
      and pg_catalog.lower(users.status) = 'active'
      and roles.name = 'admin'
  );
$$;

revoke all on function public.is_current_user_active_admin()
  from public, anon;
grant execute on function public.is_current_user_active_admin()
  to authenticated, service_role;

create or replace function public.jwt_custom_claims(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = 'public'
as $$
declare
  selected_user_id uuid;
  assigned_roles text[];
begin
  selected_user_id := (event->>'user_id')::uuid;
  assigned_roles := public.get_user_roles(selected_user_id);

  event := jsonb_set(
    event,
    '{claims,app_metadata,roles}',
    to_jsonb(assigned_roles),
    true
  );

  return event;
end;
$$;

revoke all on function public.jwt_custom_claims(jsonb)
  from public, anon, authenticated;
grant execute on function public.jwt_custom_claims(jsonb)
  to service_role, supabase_auth_admin;

drop policy if exists "Users can view their profile and active admins can view users"
  on public.users;
create policy "Users can view their profile and active admins can view users"
on public.users
for select
to authenticated
using (
  user_id = (select auth.uid())
  or public.is_current_user_active_admin()
);

drop policy if exists "Active admins can update users"
  on public.users;
create policy "Active admins can update users"
on public.users
for update
to authenticated
using (public.is_current_user_active_admin())
with check (public.is_current_user_active_admin());

drop policy if exists "Users can view their role and active admins can view roles"
  on public.user_roles;
create policy "Users can view their role and active admins can view roles"
on public.user_roles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or public.is_current_user_active_admin()
);

drop policy if exists "Active admins can insert user roles"
  on public.user_roles;
create policy "Active admins can insert user roles"
on public.user_roles
for insert
to authenticated
with check (public.is_current_user_active_admin());

drop policy if exists "Active admins can update user roles"
  on public.user_roles;
create policy "Active admins can update user roles"
on public.user_roles
for update
to authenticated
using (public.is_current_user_active_admin())
with check (public.is_current_user_active_admin());

commit;
