"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import {
  createSupabaseServerActionAdminClient,
  createSupabaseServerActionClient,
} from "@/lib/supabase/server-action";

const INVITATION_COOLDOWN_MILLISECONDS = 5 * 60 * 1000;

export type AdminDashboardUser = {
  user_id: string;
  full_name: string;
  email: string;
  status: string;
  start_date: string;
  mode_of_review: "online" | "in-house";
  payment_image_path: string | null;
  resend_available_at: string | null;
};

export const fetchUsers = async () => {
  try {
    const supabase = await createSupabaseServerActionClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in to view users");
    }

    const roles = getTokenRoles(session);

    if (!roles.includes("admin")) {
      throw new Error("You are not authorized to view users");
    }

    const supabaseAdmin = createSupabaseServerActionAdminClient();
    const { data, error } = await supabase
      .from("users")
      .select(
        "user_id, full_name, email, status, start_date, mode_of_review, payments(image_path), user_roles!inner(roles!inner(name))",
      )
      .eq("user_roles.roles.name", "reviewee")
      .order("start_date");

    if (error) {
      throw new Error(error.message);
    }

    const revieweeIds = (data ?? []).map((user) => user.user_id);
    const { data: invitationLogs, error: invitationLogsError } = revieweeIds.length
      ? await supabaseAdmin
          .from("reviewee_invitation_email_logs")
          .select("user_id, requested_at, sent_at")
          .in("user_id", revieweeIds)
          .in("delivery_status", ["sending", "sent"])
          .order("requested_at", { ascending: false })
      : { data: [], error: null };

    if (invitationLogsError) {
      throw new Error(invitationLogsError.message);
    }

    const latestInvitationTimes = new Map<string, number>();
    for (const invitationLog of invitationLogs ?? []) {
      if (!invitationLog.user_id) continue;
      const requestedAt = new Date(invitationLog.requested_at).getTime();
      const sentAt = invitationLog.sent_at
        ? new Date(invitationLog.sent_at).getTime()
        : requestedAt;
      const deliveryTime = Math.max(requestedAt, sentAt);
      const currentLatestTime = latestInvitationTimes.get(invitationLog.user_id);

      if (currentLatestTime === undefined || deliveryTime > currentLatestTime) {
        latestInvitationTimes.set(invitationLog.user_id, deliveryTime);
      }
    }

    return {
      success: true,
      users: (data ?? []).map((user) => ({
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        status: user.status,
        start_date: user.start_date,
        mode_of_review: user.mode_of_review,
        payment_image_path: user.payments?.image_path ?? null,
        resend_available_at: latestInvitationTimes.has(user.user_id)
          ? new Date(
              latestInvitationTimes.get(user.user_id)! +
                INVITATION_COOLDOWN_MILLISECONDS,
            ).toISOString()
          : null,
      })) as AdminDashboardUser[],
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      users: [] as AdminDashboardUser[],
      error: error instanceof Error ? error.message : "Unable to fetch users",
    };
  }
};
