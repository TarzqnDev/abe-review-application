"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import {
  createSupabaseServerActionAdminClient,
  createActiveSupabaseServerActionClient,
} from "@/lib/supabase/server-action";
import {
  formatInvitationCooldown,
  parseInvitationClaim,
} from "@/features/app/admin/manage-reviewees/utils/invitationCooldown";
import { headers } from "next/headers";

export const resendUserInvitation = async (userId: string) => {
  let emailWasSent = false;
  let invitationLogId: number | null = null;
  const supabaseAdmin = createSupabaseServerActionAdminClient();

  try {
    if (!userId.trim()) {
      throw new Error("Reviewee is required");
    }

    const supabase = await createActiveSupabaseServerActionClient();
    const {
      data: { user: currentUser },
      error: currentUserError,
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (currentUserError || !currentUser || !session) {
      throw new Error("You must be logged in to resend an invitation");
    }

    if (!getTokenRoles(session).includes("admin")) {
      throw new Error("You are not authorized to resend invitations");
    }

    const { data: reviewee, error: revieweeError } = await supabaseAdmin
      .from("users")
      .select("email, full_name, status, user_roles!inner(roles!inner(name))")
      .eq("user_id", userId)
      .eq("user_roles.roles.name", "reviewee")
      .single();

    if (revieweeError || !reviewee) {
      throw new Error("Reviewee not found");
    }

    if (reviewee.status !== "pending") {
      throw new Error("Invitations can only be resent to pending reviewees");
    }

    const { data: claimData, error: claimError } = await supabaseAdmin.rpc(
      "claim_reviewee_invitation",
      {
        selected_email: reviewee.email,
        selected_invitation_type: "resend",
        selected_requested_by: currentUser.id,
        selected_user_id: userId,
      },
    );

    if (claimError) {
      throw new Error(claimError.message);
    }

    const claim = parseInvitationClaim(claimData);

    if (!claim.allowed) {
      return {
        success: false,
        reason: "cooldown" as const,
        message: "Invitation not sent",
        error: `Please wait ${formatInvitationCooldown(claim.retryAfterSeconds)} before resending the email invitation.`,
      };
    }

    if (!claim.logId) {
      throw new Error("Unable to record the invitation");
    }

    invitationLogId = claim.logId;

    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const origin = headerStore.get("origin") ?? `${protocol}://${host}`;

    const { error: invitationError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(reviewee.email, {
        data: { full_name: reviewee.full_name },
        redirectTo: `${origin}/auth/accept-invite`,
      });

    if (invitationError) {
      throw new Error(invitationError.message);
    }
    emailWasSent = true;

    const { error: completeLogError } = await supabaseAdmin.rpc(
      "complete_reviewee_invitation",
      {
        selected_log_id: invitationLogId,
        selected_user_id: userId,
        was_sent: true,
      },
    );

    if (completeLogError) {
      throw new Error(completeLogError.message);
    }

    invitationLogId = null;

    return {
      success: true,
      message: "Email invitation resent successfully",
    };
  } catch (error: unknown) {
    if (invitationLogId) {
      await supabaseAdmin.rpc("complete_reviewee_invitation", {
        selected_log_id: invitationLogId,
        selected_user_id: emailWasSent ? userId : null,
        was_sent: emailWasSent,
      });
    }

    console.error(error);

    return {
      success: false,
      message: "Invitation resend failed",
      error:
        error instanceof Error ? error.message : "Unable to resend invitation",
    };
  }
};
