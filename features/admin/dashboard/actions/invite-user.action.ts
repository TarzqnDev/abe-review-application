"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import {
  createSupabaseServerActionAdminClient,
  createSupabaseServerActionClient,
} from "@/lib/supabase/server-action";
import { headers } from "next/headers";

export const inviteUser = async (formData: FormData) => {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    if (!fullName || !email || !startDate || !endDate) {
      throw new Error(
        "Full name, email, start date, and end date are required",
      );
    }

    const supabase = await createSupabaseServerActionClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in to invite a user");
    }

    const roles = getTokenRoles(session);

    if (!roles.includes("admin")) {
      throw new Error("You are not authorized to invite users");
    }

    const headerStore = await headers();
    const host =
      headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const origin = headerStore.get("origin") ?? `${protocol}://${host}`;

    const supabaseAdmin = createSupabaseServerActionAdminClient();

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: fullName,
        },
        redirectTo: `${origin}/signup`,
      },
    );

    if (error) {
      throw new Error(error.message);
    }

    const invitedUser = data.user;

    if (!invitedUser?.id) {
      throw new Error("Unable to create the invited user");
    }

    const { error: updateUserError } =
      await supabaseAdmin.auth.admin.updateUserById(invitedUser.id, {
        app_metadata: {
          ...(invitedUser.app_metadata ?? {}),
          roles: ["reviewee"],
        },
        user_metadata: {
          ...(invitedUser.user_metadata ?? {}),
          full_name: fullName,
        },
      });

    if (updateUserError) {
      throw new Error(updateUserError.message);
    }

    const { error: upsertUserError } = await supabaseAdmin.from("users").upsert(
      {
        user_id: invitedUser.id,
        status: "pending",
        full_name: fullName,
        start_date: startDate,
        end_date: endDate,
        email: email,
      },
      {
        onConflict: "user_id",
      },
    );

    if (upsertUserError) {
      throw new Error(upsertUserError.message);
    }

    return { success: true, message: "Invite sent successfully" };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Invite failed",
      error: error instanceof Error ? error.message : "Invite failed",
    };
  }
};
