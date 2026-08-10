import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { getAuthRouteIdentity } from "@/lib/auth/route-identity";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";

export default async function UnauthorizedPage() {
  const supabase = await createSupabaseServerComponentClient();
  const identity = await getAuthRouteIdentity(supabase);
  const dashboardHref = identity.assignedDashboardPath ?? "/login";

  return (
    <AuthPageShell>
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
          <ExclamationTriangleIcon
            className="size-9 text-error"
            aria-hidden="true"
          />
        </div>

        <p className="mt-6 text-sm font-semibold tracking-wider text-primary-accent uppercase">
          Error 403
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary-text">
          Access Not Authorized
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-secondary-text sm:text-base">
          Your account does not have permission to view this dashboard. Return
          to your assigned dashboard or contact an administrator if you believe
          you should have access.
        </p>

        <Link
          href={dashboardHref}
          className="mt-8 flex h-12 w-full items-center justify-center rounded-sm bg-primary-accent px-4 font-medium text-surface transition hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
        >
          Return to Dashboard
        </Link>
      </div>
    </AuthPageShell>
  );
}
