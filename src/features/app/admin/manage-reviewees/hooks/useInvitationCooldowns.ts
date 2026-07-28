import { useEffect, useState } from "react";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";

export const useInvitationCooldowns = (users: Reviewee[]) => {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const hasActiveCooldown = users.some((user) => {
    if (user.status.toLowerCase() !== "pending" || !user.resend_available_at) {
      return false;
    }

    return new Date(user.resend_available_at).getTime() > currentTime;
  });

  useEffect(() => {
    if (!hasActiveCooldown) return;

    const interval = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [hasActiveCooldown]);

  return currentTime;
};
