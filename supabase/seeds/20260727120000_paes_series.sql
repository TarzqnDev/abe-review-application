begin;

do $$
declare
  paes_area_id bigint;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtext('seed:paes-series')
  );

  select subject_areas.id
  into paes_area_id
  from public.subject_areas
  where pg_catalog.lower(pg_catalog.btrim(subject_areas.name)) =
    pg_catalog.lower('PAES Series')
  order by subject_areas.id
  limit 1;

  if paes_area_id is null then
    insert into public.subject_areas (name)
    values ('PAES Series')
    returning id into paes_area_id;
  end if;

  insert into public.subjects (name, area_id)
  select paes_subject.name, paes_area_id
  from (
    values
      ('PAES 100 Series'),
      ('PAES 200 Series'),
      ('PAES 300 Series'),
      ('PAES 400 Series'),
      ('PAES 500 Series')
  ) as paes_subject(name)
  where not exists (
    select 1
    from public.subjects
    where subjects.area_id = paes_area_id
      and pg_catalog.lower(pg_catalog.btrim(subjects.name)) =
        pg_catalog.lower(paes_subject.name)
  );
end;
$$;

commit;
