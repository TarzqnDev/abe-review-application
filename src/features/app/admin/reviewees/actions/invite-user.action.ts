"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import {
  createSupabaseServerActionAdminClient,
  createSupabaseServerActionClient,
} from "@/lib/supabase/server-action";
import {
  formatInvitationCooldown,
  parseInvitationClaim,
} from "@/features/app/admin/reviewees/utils/invitationCooldown";
import { randomUUID } from "crypto";
import { headers } from "next/headers";

const MAX_PAYMENT_IMAGE_SIZE = 5 * 1024 * 1024;
const PAYMENT_IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const REVIEW_MODES = ["online", "in-house"] as const;

export const inviteUser = async (formData: FormData) => {
  let emailWasSent = false;
  let invitedUserId: string | null = null;
  let invitationLogId: number | null = null;
  let paymentImagePath: string | null = null;
  const supabaseAdmin = createSupabaseServerActionAdminClient();

  try {
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const modeOfReview = String(formData.get("modeOfReview") ?? "").toLowerCase();
    const paymentImage = formData.get("paymentImage");

    if (!fullName || !email || !modeOfReview) {
      throw new Error("Full name, email, and mode of review are required");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error("Enter a valid email address");
    }

    if (!REVIEW_MODES.includes(modeOfReview as (typeof REVIEW_MODES)[number])) {
      throw new Error("Mode of review must be online or in-house");
    }

    if (!(paymentImage instanceof File) || paymentImage.size === 0) {
      throw new Error("Proof of payment is required");
    }

    const paymentImageExtension = PAYMENT_IMAGE_EXTENSIONS[paymentImage.type];

    if (!paymentImageExtension) {
      throw new Error("Proof of payment must be a PNG, JPEG, or WebP image");
    }

    if (paymentImage.size > MAX_PAYMENT_IMAGE_SIZE) {
      throw new Error("Proof of payment must not exceed 5 MB");
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
      throw new Error("You must be logged in to invite a user");
    }

    if (!getTokenRoles(session).includes("admin")) {
      throw new Error("You are not authorized to invite users");
    }

    const { data: matchingProfiles, error: matchingProfilesError } =
      await supabaseAdmin
        .from("users")
        .select("email")
        .ilike("email", email);

    if (matchingProfilesError) {
      throw new Error(matchingProfilesError.message);
    }

    if (
      matchingProfiles.some(
        (profile) => profile.email.trim().toLowerCase() === email,
      )
    ) {
      throw new Error(
        "This email is already registered. Use Resend for a pending reviewee.",
      );
    }

    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const origin = headerStore.get("origin") ?? `${protocol}://${host}`;

    const { data: claimData, error: claimError } = await supabaseAdmin.rpc(
      "claim_reviewee_invitation",
      {
        selected_email: email,
        selected_invitation_type: "initial",
        selected_requested_by: currentUser.id,
        selected_user_id: null,
      },
    );
    if (claimError) throw new Error(claimError.message);

    const claim = parseInvitationClaim(claimData);
    if (!claim.allowed) {
      return {
        success: false,
        reason: "cooldown" as const,
        message: "Invitation not sent",
        error: `Please wait ${formatInvitationCooldown(claim.retryAfterSeconds)} before sending another email invitation to this reviewee.`,
      };
    }

    if (!claim.logId) {
      throw new Error("Unable to record the invitation");
    }

    invitationLogId = claim.logId;

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName },
      redirectTo: `${origin}/auth/accept-invite`,
    });

    if (error) throw new Error(error.message);
    emailWasSent = true;

    invitedUserId = data.user?.id ?? null;
    if (!invitedUserId) throw new Error("Unable to create the invited user");

    const { error: completeLogError } = await supabaseAdmin.rpc(
      "complete_reviewee_invitation",
      {
        selected_log_id: invitationLogId,
        selected_user_id: invitedUserId,
        was_sent: true,
      },
    );
    if (completeLogError) throw new Error(completeLogError.message);

    invitationLogId = null;

    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      invitedUserId,
      {
        app_metadata: { ...(data.user.app_metadata ?? {}), roles: ["reviewee"] },
        user_metadata: { ...(data.user.user_metadata ?? {}), full_name: fullName },
      },
    );
    if (updateUserError) throw new Error(updateUserError.message);

    const { error: upsertUserError } = await supabaseAdmin.from("users").upsert(
      {
        user_id: invitedUserId,
        status: "pending",
        full_name: fullName,
        email,
        mode_of_review: modeOfReview,
      },
      { onConflict: "user_id" },
    );
    if (upsertUserError) throw new Error(upsertUserError.message);

    const { data: revieweeRole, error: revieweeRoleError } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("name", "reviewee")
      .single();
    if (revieweeRoleError) throw new Error(revieweeRoleError.message);

    const { error: assignRoleError } = await supabaseAdmin.from("user_roles").upsert(
      { user_id: invitedUserId, role_id: revieweeRole.id },
      { onConflict: "user_id" },
    );
    if (assignRoleError) throw new Error(assignRoleError.message);

    paymentImagePath = `payment-images/${invitedUserId}/${randomUUID()}.${paymentImageExtension}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("payments")
      .upload(paymentImagePath, paymentImage, {
        contentType: paymentImage.type,
        upsert: false,
      });
    if (uploadError) throw new Error(uploadError.message);

    const { error: paymentError } = await supabaseAdmin.from("payments").insert({
      user_id: invitedUserId,
      image_path: paymentImagePath,
    });
    if (paymentError) throw new Error(paymentError.message);

    return { success: true, message: "Invite sent successfully" };
  } catch (error: unknown) {
    if (invitationLogId) {
      await supabaseAdmin.rpc("complete_reviewee_invitation", {
        selected_log_id: invitationLogId,
        selected_user_id: emailWasSent ? invitedUserId : null,
        was_sent: emailWasSent,
      });
    }

    if (paymentImagePath) {
      await supabaseAdmin.storage.from("payments").remove([paymentImagePath]);
    }

    console.error(error);
    return {
      success: false,
      message: "Invite failed",
      error: error instanceof Error ? error.message : "Invite failed",
    };
  }
};
