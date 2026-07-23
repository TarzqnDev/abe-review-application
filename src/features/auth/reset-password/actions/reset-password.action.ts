"use server";

import { cookies } from "next/headers";
import { createSupabaseServerActionAdminClient } from "@/lib/supabase/server-action";
import {
  getPasswordRecoveryCookieOptions,
  isRetryableAuthFailure,
  PASSWORD_RECOVERY_COOKIE_NAME,
} from "@/features/auth/reset-password/utils/passwordRecovery";
import {
  createPasswordRecoveryIdentity,
  readPasswordRecoveryUserId,
} from "@/features/auth/reset-password/utils/passwordRecoveryIdentity";

class PasswordResetError extends Error {}

const clearPasswordRecoveryCookie = async () => {
  const cookieStore = await cookies();

  cookieStore.set(PASSWORD_RECOVERY_COOKIE_NAME, "", {
    ...getPasswordRecoveryCookieOptions(),
    maxAge: 0,
  });
};

const getPasswordRecoveryUserId = async () => {
  const cookieStore = await cookies();

  return readPasswordRecoveryUserId(
    cookieStore.get(PASSWORD_RECOVERY_COOKIE_NAME)?.value,
  );
};

export const initializePasswordRecovery = async (accessToken: string) => {
  try {
    if (!accessToken) {
      await clearPasswordRecoveryCookie();

      return { success: false, retryable: false };
    }

    const supabaseAdmin = createSupabaseServerActionAdminClient();
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (error) {
      if (isRetryableAuthFailure(error)) {
        return { success: false, retryable: true };
      }

      await clearPasswordRecoveryCookie();

      return { success: false, retryable: false };
    }

    if (!user) {
      await clearPasswordRecoveryCookie();

      return { success: false, retryable: false };
    }

    const cookieStore = await cookies();

    cookieStore.set(
      PASSWORD_RECOVERY_COOKIE_NAME,
      createPasswordRecoveryIdentity(user.id),
      getPasswordRecoveryCookieOptions(),
    );

    return { success: true, retryable: false };
  } catch (error: unknown) {
    console.error("Unable to verify the password recovery request", error);

    return { success: false, retryable: true };
  }
};

export const getPasswordRecoveryStatus = async () => {
  try {
    const userId = await getPasswordRecoveryUserId();

    if (!userId) {
      await clearPasswordRecoveryCookie();

      return { isValid: false, retryable: false };
    }

    const supabaseAdmin = createSupabaseServerActionAdminClient();
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      if (isRetryableAuthFailure(error)) {
        return { isValid: false, retryable: true };
      }

      await clearPasswordRecoveryCookie();

      return { isValid: false, retryable: false };
    }

    if (!user) {
      await clearPasswordRecoveryCookie();

      return { isValid: false, retryable: false };
    }

    return { isValid: true, retryable: false };
  } catch (error: unknown) {
    console.error("Unable to check the password recovery status", error);

    return { isValid: false, retryable: true };
  }
};

export const resetPassword = async (formData: FormData) => {
  try {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const userId = await getPasswordRecoveryUserId();

    if (!userId) {
      await clearPasswordRecoveryCookie();

      throw new PasswordResetError(
        "Your password reset link is invalid or has expired",
      );
    }

    if (typeof password !== "string" || !password) {
      throw new PasswordResetError("Password is required");
    }

    if (typeof confirmPassword !== "string" || !confirmPassword) {
      throw new PasswordResetError("Please confirm your password");
    }

    if (password.length < 6) {
      throw new PasswordResetError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      throw new PasswordResetError("Passwords do not match");
    }

    const supabaseAdmin = createSupabaseServerActionAdminClient();
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, { password });

    if (updateError) {
      throw new PasswordResetError(
        updateError.code === "weak_password"
          ? "Password does not meet the security requirements"
          : "Unable to reset your password. Please try again",
      );
    }

    try {
      await clearPasswordRecoveryCookie();
    } catch (recoveryCookieError: unknown) {
      console.error(
        "Unable to clear the password recovery identity",
        recoveryCookieError,
      );
    }

    return {
      success: true,
      message: "Your password has been reset successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      error:
        error instanceof PasswordResetError
          ? error.message
          : "Unable to reset your password. Please try again",
    };
  }
};
