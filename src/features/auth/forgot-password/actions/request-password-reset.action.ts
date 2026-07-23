"use server";

import type { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCAL_DEVELOPMENT_ORIGIN = "http://localhost:3000";

const getValidOrigin = (url: string | undefined) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) return null;

    return parsedUrl.origin;
  } catch {
    return null;
  }
};

const getApplicationOrigin = async () => {
  const configuredOrigin = getValidOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (configuredOrigin) return configuredOrigin;

  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost ?? headerStore.get("host");
  const forwardedProtocol = headerStore.get("x-forwarded-proto");
  const protocol = forwardedProtocol ?? "http";
  const requestOrigin = getValidOrigin(headerStore.get("origin") ?? undefined);
  const forwardedOrigin = getValidOrigin(
    host ? `${protocol}://${host}` : undefined,
  );

  return requestOrigin ?? forwardedOrigin ?? LOCAL_DEVELOPMENT_ORIGIN;
};

export const requestPasswordReset = async (formData: FormData) => {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { success: false, error: "Email is required" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          flowType: "implicit",
          persistSession: false,
        },
      },
    );
    const applicationOrigin = await getApplicationOrigin();
    const redirectUrl = new URL("/auth/reset-password", applicationOrigin);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl.toString(),
    });

    if (error) {
      console.error(error);

      return {
        success: false,
        error:
          "Unable to send the reset email right now. Please wait a moment and try again.",
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      error: "Unable to send the reset email right now. Please try again.",
    };
  }
};
