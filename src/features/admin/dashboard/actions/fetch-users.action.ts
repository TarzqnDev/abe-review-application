"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export type AdminDashboardUser = {
  user_id: string;
  full_name: string;
  email: string;
  status: string;
  start_date: string;
  end_date: string;
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
      .select("user_id, full_name, email, status, start_date, end_date")
      .order("start_date");

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      users: (data ?? []) as AdminDashboardUser[],
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
