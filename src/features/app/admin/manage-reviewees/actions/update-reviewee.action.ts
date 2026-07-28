"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import {
  createSupabaseServerActionAdminClient,
  createSupabaseServerActionClient,
} from "@/lib/supabase/server-action";

const REVIEW_MODES = ["online", "in-house"] as const;

export const updateReviewee = async (formData: FormData) => {
  try {
    const userId = String(formData.get("userId") ?? "").trim();
    const fullName = String(formData.get("fullName") ?? "").trim();
    const modeOfReview = String(formData.get("modeOfReview") ?? "").toLowerCase();
    const status = String(formData.get("status") ?? "").toLowerCase();

    if (!userId || !fullName || !modeOfReview || !status) {
      throw new Error("Full name, mode of review, and status are required");
    }

    if (!REVIEW_MODES.includes(modeOfReview as (typeof REVIEW_MODES)[number])) {
      throw new Error("Mode of review must be online or in-house");
    }

    const supabase = await createSupabaseServerActionClient();
    const {
      data: { user: currentUser },
      error: currentUserError,
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (currentUserError || !currentUser || !session) {
      throw new Error("You must be logged in to edit a reviewee");
    }

    if (!getTokenRoles(session).includes("admin")) {
      throw new Error("You are not authorized to edit reviewees");
    }

    const supabaseAdmin = createSupabaseServerActionAdminClient();
    const { data: reviewee, error: revieweeError } = await supabaseAdmin
      .from("users")
      .select(
        "full_name, mode_of_review, status, user_roles!inner(roles!inner(name))",
      )
      .eq("user_id", userId)
      .eq("user_roles.roles.name", "reviewee")
      .single();

    if (revieweeError || !reviewee) {
      throw new Error("Reviewee not found");
    }

    const allowedStatuses =
      reviewee.status === "active"
        ? ["active", "inactive"]
        : [reviewee.status.toLowerCase()];

    if (!allowedStatuses.includes(status)) {
      throw new Error(
        reviewee.status === "pending"
          ? "A pending reviewee's status cannot be changed"
          : "This reviewee's status cannot be changed",
      );
    }

    const { error: updateRevieweeError } = await supabaseAdmin
      .from("users")
      .update({
        full_name: fullName,
        mode_of_review: modeOfReview,
        status,
      })
      .eq("user_id", userId);

    if (updateRevieweeError) {
      throw new Error(updateRevieweeError.message);
    }

    const {
      data: { user: authUser },
      error: authUserError,
    } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authUserError || !authUser) {
      await supabaseAdmin
        .from("users")
        .update({
          full_name: reviewee.full_name,
          mode_of_review: reviewee.mode_of_review,
          status: reviewee.status,
        })
        .eq("user_id", userId);
      throw new Error(authUserError?.message ?? "Reviewee account not found");
    }

    const { error: updateAuthUserError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...authUser.user_metadata,
          full_name: fullName,
        },
      });

    if (updateAuthUserError) {
      await supabaseAdmin
        .from("users")
        .update({
          full_name: reviewee.full_name,
          mode_of_review: reviewee.mode_of_review,
          status: reviewee.status,
        })
        .eq("user_id", userId);
      throw new Error(updateAuthUserError.message);
    }

    return { success: true, message: "Reviewee updated successfully" };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Reviewee update failed",
      error:
        error instanceof Error ? error.message : "Unable to update reviewee",
    };
  }
};
