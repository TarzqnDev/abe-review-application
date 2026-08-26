import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { PASSWORD_RECOVERY_COOKIE_MAX_AGE } from "@/features/auth/reset-password/utils/passwordRecovery";

type PasswordRecoveryIdentity = {
  expiresAt: number;
  userId: string;
};

const USER_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SIGNATURE_CONTEXT = "abe-password-recovery";

const getSigningSecret = () => {
  const signingSecret = process.env.SUPABASE_SECRET_KEY;

  if (!signingSecret) {
    throw new Error("SUPABASE_SECRET_KEY is not configured");
  }

  return signingSecret;
};

const signPayload = (payload: string) =>
  createHmac("sha256", getSigningSecret())
    .update(`${SIGNATURE_CONTEXT}:${payload}`)
    .digest("base64url");

export const createPasswordRecoveryIdentity = (userId: string) => {
  const identity: PasswordRecoveryIdentity = {
    expiresAt: Date.now() + PASSWORD_RECOVERY_COOKIE_MAX_AGE * 1000,
    userId,
  };
  const payload = Buffer.from(JSON.stringify(identity)).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
};

export const readPasswordRecoveryUserId = (cookieValue?: string) => {
  if (!cookieValue) return null;

  const [payload, providedSignature, extraValue] = cookieValue.split(".");

  if (!payload || !providedSignature || extraValue) return null;

  const expectedSignatureBuffer = Buffer.from(
    signPayload(payload),
    "base64url",
  );
  const providedSignatureBuffer = Buffer.from(
    providedSignature,
    "base64url",
  );

  if (
    expectedSignatureBuffer.length !== providedSignatureBuffer.length ||
    !timingSafeEqual(expectedSignatureBuffer, providedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const identity = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<PasswordRecoveryIdentity>;

    if (
      typeof identity.userId !== "string" ||
      !USER_ID_PATTERN.test(identity.userId) ||
      typeof identity.expiresAt !== "number" ||
      !Number.isSafeInteger(identity.expiresAt) ||
      identity.expiresAt <= Date.now()
    ) {
      return null;
    }

    return identity.userId;
  } catch {
    return null;
  }
};
