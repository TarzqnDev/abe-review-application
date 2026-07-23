export const AUTH_NOTICE_QUERY_PARAMETER = "authNotice";

export const AUTH_NOTICES = {
  loginSuccess: "login-success",
  alreadyLoggedIn: "already-logged-in",
} as const;

export const AUTH_NOTICE_MESSAGES = {
  [AUTH_NOTICES.loginSuccess]: "Logged in successfully.",
  [AUTH_NOTICES.alreadyLoggedIn]:
    "You are already logged in. Please log out before logging in to another account.",
} as const;

export type AuthNotice = keyof typeof AUTH_NOTICE_MESSAGES;
