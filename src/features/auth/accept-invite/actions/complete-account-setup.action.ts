"use server";

import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const completeAccountSetup = async (formData: FormData) => {
  try {
    const password = formData.get("password") as string;

    if (!password) {
      throw new Error("Password is required");
    }

    const supabase = await createSupabaseServerActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Your invite session is invalid or has expired");
    }

    const { data: accountSetupData, error: accountSetupError } = await supabase
      .from("users")
      .select("account_setup_completed_at")
      .eq("user_id", user.id)
      .single();

    if (accountSetupError) {
      throw new Error(accountSetupError.message);
    }

    if (accountSetupData.account_setup_completed_at) {
      throw new Error("This invitation has already been accepted");
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { data: rolesData, error: rolesError } = await supabase
      .from("roles")
      .select();

    if (rolesError) {
      throw new Error(rolesError.message);
    }

    let revieweeRoleId = null;

    rolesData.map((role) => {
      if (role.name === "reviewee") {
        revieweeRoleId = role.id;
        return;
      }
    });

    if (!revieweeRoleId) {
      throw new Error("Unable to set roles to just created user");
    }

    const { error: insertRoleError } = await supabase
      .from("user_roles")
      .upsert(
        { user_id: user.id, role_id: revieweeRoleId },
        { onConflict: "user_id" },
      );

    if (insertRoleError) {
      throw new Error(insertRoleError.message);
    }

    const { error: statusUpdateError } = await supabase
      .from("users")
      .update({
        status: "active",
        account_setup_completed_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (statusUpdateError) {
      throw new Error(statusUpdateError.message);
    }

    await supabase.auth.refreshSession();

    return { success: true, message: "Account setup completed successfully" };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Account setup failed",
      error: error instanceof Error ? error.message : "Account setup failed",
    };
  }
};
