"use server";

import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const getAccountSetupStatus = async () => {
  try {
    const supabase = await createSupabaseServerActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Your invite session is invalid or has expired");
    }

    const { data, error } = await supabase
      .from("users")
      .select("account_setup_completed_at")
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      isAccountSetupCompleted: Boolean(data.account_setup_completed_at),
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      isAccountSetupCompleted: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to check your account setup status",
    };
  }
};
