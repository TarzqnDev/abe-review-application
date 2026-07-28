"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import {
  createSupabaseServerActionAdminClient,
  createSupabaseServerActionClient,
} from "@/lib/supabase/server-action";

const PAYMENT_IMAGE_PATH_PATTERN = /^payment-images\/[0-9a-f-]{36}\/[0-9a-f-]+\.(?:jpg|png|webp)$/i;

export const getPaymentProofUrl = async (imagePath: string) => {
  try {
    if (!PAYMENT_IMAGE_PATH_PATTERN.test(imagePath)) {
      throw new Error("Invalid proof of payment path");
    }

    const supabase = await createSupabaseServerActionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (userError || !user || !session) {
      throw new Error("You must be logged in to view payment proofs");
    }

    if (!getTokenRoles(session).includes("admin")) {
      throw new Error("You are not authorized to view payment proofs");
    }

    const supabaseAdmin = createSupabaseServerActionAdminClient();
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("image_path, users!inner(user_roles!inner(roles!inner(name)))")
      .eq("image_path", imagePath)
      .eq("users.user_roles.roles.name", "reviewee")
      .maybeSingle();

    if (paymentError) throw new Error(paymentError.message);
    if (!payment) throw new Error("Proof of payment was not found");

    const { data, error } = await supabaseAdmin.storage
      .from("payments")
      .createSignedUrl(payment.image_path, 60 * 5);

    if (error) throw new Error(error.message);
    return { success: true, signedUrl: data.signedUrl };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      signedUrl: null,
      error: error instanceof Error ? error.message : "Unable to load proof of payment",
    };
  }
};
