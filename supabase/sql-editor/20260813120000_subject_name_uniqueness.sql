begin;

create or replace function public.normalize_subject_name(
  subject_name text
)
returns text
language sql
immutable
set search_path = ''
as $$
  select pg_catalog.lower(
    pg_catalog.regexp_replace(
      pg_catalog.btrim(subject_name),
      '[[:space:]]+',
      ' ',
      'g'
    )
  );
$$;

do $$
declare
  duplicate_subjects text;
begin
  select pg_catalog.string_agg(
    pg_catalog.format('%s (area %s)', normalized_name, area_id),
    ', '
    order by area_id, normalized_name
  )
  into duplicate_subjects
  from (
    select
      subjects.area_id,
      public.normalize_subject_name(subjects.name) as normalized_name
    from public.subjects
    group by subjects.area_id, public.normalize_subject_name(subjects.name)
    having count(*) > 1
  ) as duplicate_subject_groups;

  if duplicate_subjects is not null then
    raise exception
      'Cannot enforce unique subject names. Resolve these duplicate area/name pairs first: %',
      duplicate_subjects
      using errcode = '23505';
  end if;
end;
$$;

create unique index if not exists subjects_area_normalized_name_key
  on public.subjects (
    area_id,
    public.normalize_subject_name(name)
  );

commit;
