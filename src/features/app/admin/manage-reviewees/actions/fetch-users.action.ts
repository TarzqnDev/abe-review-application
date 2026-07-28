"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export type AdminDashboardUser = {
  user_id: string;
  full_name: string;
  email: string;
  status: string;
  start_date: string;
  mode_of_review: "online" | "in-house";
  payment_image_path: string | null;
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
