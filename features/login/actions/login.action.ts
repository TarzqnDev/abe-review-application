"use server";

import { createSupabaseServerActionClient } from "@/lib/supabase/server-action";

export const loginUser = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const supabase = await createSupabaseServerActionClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Login successfull" };
  } catch (error: any) {
    console.error(error);

    return { success: false, message: "Login failed", error: error.message };
  }
};
