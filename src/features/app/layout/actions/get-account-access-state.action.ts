"use server";

import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const getAccountAccessState = async () => {
  const supabase = await createSupabaseServerActionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { isAuthenticated: false, isInactive: false };
  }

  const { data: account, error: accountError } = await supabase
    .from("users")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (accountError || !account) {
    return { isAuthenticated: true, isInactive: null };
  }

  return {
    isAuthenticated: true,
    isInactive: account.status.toLowerCase() !== "active",
  };
};
