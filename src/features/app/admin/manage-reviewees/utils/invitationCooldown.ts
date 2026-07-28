import type { Json } from "@/types/database.types";

type InvitationClaim = {
  allowed: boolean;
  logId: number | null;
  retryAfterSeconds: number;
};

export const parseInvitationClaim = (claim: Json): InvitationClaim => {
  if (!claim || Array.isArray(claim) || typeof claim !== "object") {
    throw new Error("Unable to verify the invitation cooldown");
  }

  const allowed = claim.allowed;
  const logId = claim.log_id;
  const retryAfterSeconds = claim.retry_after_seconds;

  if (
    typeof allowed !== "boolean" ||
    (logId !== undefined && logId !== null && typeof logId !== "number") ||
    typeof retryAfterSeconds !== "number"
  ) {
    throw new Error("Unable to verify the invitation cooldown");
  }

  return {
    allowed,
    logId: typeof logId === "number" ? logId : null,
    retryAfterSeconds: Math.max(0, Math.ceil(retryAfterSeconds)),
  };
};

export const formatInvitationCooldown = (remainingSeconds: number) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const minuteLabel = minutes === 1 ? "minute" : "minutes";
  const secondLabel = seconds === 1 ? "second" : "seconds";

  return `${minutes} ${minuteLabel} and ${seconds} ${secondLabel}`;
};
