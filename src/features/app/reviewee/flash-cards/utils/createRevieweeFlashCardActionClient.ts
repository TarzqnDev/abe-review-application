import { createActiveSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const createRevieweeFlashCardActionClient = async () => {
  const supabase = await createActiveSupabaseServerActionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to manage flash cards");
  }

  const { data: revieweeRole, error: roleError } = await supabase
    .from("user_roles")
    .select("id, roles!inner(name)")
    .eq("user_id", user.id)
    .eq("roles.name", "reviewee")
    .maybeSingle();

  if (roleError || !revieweeRole) {
    throw new Error("You are not authorized to manage flash cards");
  }

  return { supabase, user };
};
