import { getAuthRouteIdentity } from "@/lib/auth/route-identity";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createSupabaseServerComponentClient();
  const identity = await getAuthRouteIdentity(supabase);

  if (!identity.isAuthenticated) redirect("/login");

  if (identity.assignedDashboardPath) {
    redirect(identity.assignedDashboardPath);
  }

  redirect("/unauthorized");
}
