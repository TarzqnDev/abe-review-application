import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const createAdminSubjectActionClient = async () => {
  const supabase = await createSupabaseServerActionClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You must be logged in to manage questions");
  }

  const roles = getTokenRoles(session);

  if (!roles.includes("admin")) {
    throw new Error("You are not authorized to manage questions");
  }

  return supabase;
};
