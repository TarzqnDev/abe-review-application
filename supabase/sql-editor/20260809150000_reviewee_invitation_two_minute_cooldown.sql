create or replace function public.claim_reviewee_invitation(
  selected_user_id uuid,
  selected_email text,
  selected_invitation_type text,
  selected_requested_by uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  claim_timestamp timestamptz := pg_catalog.clock_timestamp();
  latest_delivery_time timestamptz;
  normalized_email text := lower(trim(selected_email));
  invitation_log_id bigint;
  retry_after_seconds integer;
begin
  if selected_invitation_type not in ('initial', 'resend') then
    raise exception 'Invalid invitation type';
  end if;

  if normalized_email is null or normalized_email = '' then
    raise exception 'Reviewee email is required';
  end if;

  perform pg_advisory_xact_lock(
    pg_catalog.hashtextextended(normalized_email, 0)
  );

  if selected_invitation_type = 'resend' and not exists (
    select 1
    from public.users
    where users.user_id = selected_user_id
      and lower(users.email) = normalized_email
      and users.status = 'pending'
      and exists (
        select 1
        from public.user_roles
        join public.roles on roles.id = user_roles.role_id
        where user_roles.user_id = users.user_id
          and roles.name = 'reviewee'
      )
  ) then
    raise exception 'Pending reviewee not found';
  end if;

  select greatest(
    invitation_email_logs.requested_at,
    coalesce(invitation_email_logs.sent_at, invitation_email_logs.requested_at)
  )
  into latest_delivery_time
  from public.reviewee_invitation_email_logs as invitation_email_logs
  where lower(invitation_email_logs.email) = normalized_email
    and invitation_email_logs.delivery_status in ('sending', 'sent')
  order by greatest(
    invitation_email_logs.requested_at,
    coalesce(invitation_email_logs.sent_at, invitation_email_logs.requested_at)
  ) desc
  limit 1;

  if latest_delivery_time is not null
    and latest_delivery_time + interval '3 minutes' > claim_timestamp
  then
    retry_after_seconds := greatest(
      1,
      ceil(
        extract(
          epoch from latest_delivery_time + interval '3 minutes' - claim_timestamp
        )
      )::integer
    );

    return jsonb_build_object(
      'allowed', false,
      'retry_after_seconds', retry_after_seconds
    );
  end if;

  insert into public.reviewee_invitation_email_logs (
    user_id,
    email,
    invitation_type,
    delivery_status,
    requested_by,
    requested_at
  )
  values (
    selected_user_id,
    normalized_email,
    selected_invitation_type,
    'sending',
    selected_requested_by,
    claim_timestamp
  )
  returning id into invitation_log_id;

  return jsonb_build_object(
    'allowed', true,
    'log_id', invitation_log_id,
    'retry_after_seconds', 0
  );
end;
$$;
