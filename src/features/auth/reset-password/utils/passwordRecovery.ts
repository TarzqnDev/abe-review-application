export const PASSWORD_RECOVERY_COOKIE_NAME = "abe-password-recovery";
export const PASSWORD_RECOVERY_COOKIE_MAX_AGE = 60 * 60;
export const PASSWORD_RECOVERY_COOKIE_PATH = "/auth/reset-password";

export const getPasswordRecoveryCookieOptions = () =>
  ({
    httpOnly: true,
    maxAge: PASSWORD_RECOVERY_COOKIE_MAX_AGE,
    path: PASSWORD_RECOVERY_COOKIE_PATH,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  }) as const;

export const isRetryableAuthFailure = (error: unknown) => {
  if (!error || typeof error !== "object" || !("status" in error)) return true;

  const status = error.status;
  const isRetryableFetchError =
    "name" in error && error.name === "AuthRetryableFetchError";

  return (
    isRetryableFetchError ||
    typeof status !== "number" ||
    status <= 0 ||
    status === 408 ||
    status === 429 ||
    status >= 500
  );
};
