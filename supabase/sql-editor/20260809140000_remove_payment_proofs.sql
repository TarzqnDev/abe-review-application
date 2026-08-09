begin;

drop policy if exists "Admins can view payments" on public.payments;
drop policy if exists "Active admins can view payments" on public.payments;
drop policy if exists "Active accounts only" on public.payments;

drop table if exists public.payments cascade;

commit;
