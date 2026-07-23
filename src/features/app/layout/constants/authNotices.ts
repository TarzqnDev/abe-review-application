export const AUTH_NOTICE_QUERY_PARAMETER = "authNotice";

export const AUTH_NOTICES = {
  loginSuccess: "login-success",
  alreadyLoggedIn: "already-logged-in",
  forgotPasswordAlreadyLoggedIn: "forgot-password-already-logged-in",
  resetPasswordAlreadyLoggedIn: "reset-password-already-logged-in",
} as const;

export const AUTH_NOTICE_MESSAGES = {
  [AUTH_NOTICES.loginSuccess]: "Logged in successfully.",
  [AUTH_NOTICES.alreadyLoggedIn]:
    "You are already logged in. Please log out before logging in to another account.",
  [AUTH_NOTICES.forgotPasswordAlreadyLoggedIn]:
    "You are already logged in. Please log out before requesting a password reset.",
  [AUTH_NOTICES.resetPasswordAlreadyLoggedIn]:
    "You are already logged in. Please log out before resetting your password.",
} as const;

export type AuthNotice = keyof typeof AUTH_NOTICE_MESSAGES;
