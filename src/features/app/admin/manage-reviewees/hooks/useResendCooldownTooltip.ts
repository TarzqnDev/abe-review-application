import { useEffect, useRef, useState } from "react";
import { formatInvitationCooldown } from "@/features/app/admin/manage-reviewees/utils/invitationCooldown";

type ResendCooldownTooltip = {
  isVisible: boolean;
  left: number;
  message: string;
  top: number;
};

const TOOLTIP_VISIBLE_DURATION_MS = 2500;
const TOOLTIP_FADE_DURATION_MS = 300;

export const useResendCooldownTooltip = () => {
  const [tooltip, setTooltip] = useState<ResendCooldownTooltip | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const cleanupTimeoutRef = useRef<number | null>(null);

  const clearTooltipTimers = () => {
    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    if (cleanupTimeoutRef.current !== null) {
      window.clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
  };

  const showCooldownTooltip = (
    trigger: HTMLElement,
    remainingSeconds: number,
  ) => {
    if (tooltip !== null) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipHalfWidth = 128;
    const viewportPadding = 16;
    const left = Math.min(
      Math.max(triggerRect.left + triggerRect.width / 2, tooltipHalfWidth + viewportPadding),
      window.innerWidth - tooltipHalfWidth - viewportPadding,
    );

    setTooltip({
      isVisible: true,
      left,
      message: `Please wait ${formatInvitationCooldown(remainingSeconds)} before resending.`,
      top: triggerRect.top - 8,
    });

    fadeTimeoutRef.current = window.setTimeout(() => {
      setTooltip((currentTooltip) =>
        currentTooltip ? { ...currentTooltip, isVisible: false } : null,
      );

      cleanupTimeoutRef.current = window.setTimeout(() => {
        setTooltip(null);
      }, TOOLTIP_FADE_DURATION_MS);
    }, TOOLTIP_VISIBLE_DURATION_MS);
  };

  useEffect(
    () => () => {
      clearTooltipTimers();
    },
    [],
  );

  return {
    showCooldownTooltip,
    tooltip,
  };
};
