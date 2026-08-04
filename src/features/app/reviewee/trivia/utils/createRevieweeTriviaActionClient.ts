import { createActiveSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const createRevieweeTriviaActionClient = async () => {
  const supabase = await createActiveSupabaseServerActionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to view trivia");
  }

  const { data: revieweeRole, error: roleError } = await supabase
    .from("user_roles")
    .select("id, roles!inner(name)")
    .eq("user_id", user.id)
    .eq("roles.name", "reviewee")
    .maybeSingle();

  if (roleError || !revieweeRole) {
    throw new Error("You are not authorized to view trivia");
  }

  return supabase;
};
