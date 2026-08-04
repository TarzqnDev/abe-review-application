import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createActiveSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const createAdminTriviaActionClient = async () => {
  const supabase = await createActiveSupabaseServerActionClient();
  const [sessionResult, userResult] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ]);
  const session = sessionResult.data.session;

  if (!session || userResult.error || !userResult.data.user) {
    throw new Error("You must be logged in to manage trivias");
  }

  if (!getTokenRoles(session).includes("admin")) {
    throw new Error("You are not authorized to manage trivias");
  }

  return supabase;
};
