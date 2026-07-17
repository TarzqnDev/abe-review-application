import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const createRevieweeQuizActionClient = async () => {
  const supabase = await createSupabaseServerActionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to play a quiz");
  }

  const { data: revieweeRole, error: roleError } = await supabase
    .from("user_roles")
    .select("id, roles!inner(name)")
    .eq("user_id", user.id)
    .eq("roles.name", "reviewee")
    .maybeSingle();

  if (roleError || !revieweeRole) {
    throw new Error("You are not authorized to play a quiz");
  }

  return supabase;
};
