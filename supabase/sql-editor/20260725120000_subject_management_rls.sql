begin;

alter table public.subject_areas enable row level security;
alter table public.subjects enable row level security;

drop policy if exists "Enable all operations for authenticated users only"
  on public.subject_areas;
drop policy if exists "Authenticated users can view subject areas"
  on public.subject_areas;
create policy "Authenticated users can view subject areas"
on public.subject_areas
for select
to authenticated
using (true);

drop policy if exists "Admins can manage subject areas"
  on public.subject_areas;
create policy "Admins can manage subject areas"
on public.subject_areas
for all
to authenticated
using (
  'admin' = any(public.get_user_roles((select auth.uid())))
)
with check (
  'admin' = any(public.get_user_roles((select auth.uid())))
);

drop policy if exists "Enable all operations for authenticated users only"
  on public.subjects;
drop policy if exists "Authenticated users can view subjects"
  on public.subjects;
create policy "Authenticated users can view subjects"
on public.subjects
for select
to authenticated
using (true);

drop policy if exists "Admins can manage subjects"
  on public.subjects;
create policy "Admins can manage subjects"
on public.subjects
for all
to authenticated
using (
  'admin' = any(public.get_user_roles((select auth.uid())))
)
with check (
  'admin' = any(public.get_user_roles((select auth.uid())))
);

revoke all on table public.subject_areas from public, anon, authenticated;
grant select, insert, update, delete
  on table public.subject_areas to authenticated;
grant all on table public.subject_areas to service_role;

revoke all on table public.subjects from public, anon, authenticated;
grant select, insert, update, delete on table public.subjects to authenticated;
grant all on table public.subjects to service_role;

revoke all on sequence public.subject_areas_id_seq
  from public, anon, authenticated;
grant usage, select on sequence public.subject_areas_id_seq to authenticated;
grant all on sequence public.subject_areas_id_seq to service_role;

revoke all on sequence public.subjects_id_seq
  from public, anon, authenticated;
grant usage, select on sequence public.subjects_id_seq to authenticated;
grant all on sequence public.subjects_id_seq to service_role;

commit;
