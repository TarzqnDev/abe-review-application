import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { resendUserInvitation } from "@/features/app/admin/manage-reviewees/actions/resend-user-invitation.action";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type ResendInvitationConfirmationModalOptions = {
  onClose: () => void;
  onNotice: (message: string) => void;
  reviewee: Reviewee | null;
};

export const useResendInvitationConfirmationModal = ({
  onClose,
  onNotice,
  reviewee,
}: ResendInvitationConfirmationModalOptions) => {
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);
  const isResendingRef = useRef(false);

  useBodyScrollLock(reviewee !== null);

  const handleClose = useCallback(() => {
    if (isResendingRef.current) return;
    setError("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!reviewee) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = window.requestAnimationFrame(() =>
      cancelButtonRef.current?.focus(),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastFocusableElement
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [handleClose, reviewee]);

  const handleResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewee) return;

    setError("");
    isResendingRef.current = true;
    setIsResending(true);

    try {
      const result = await resendUserInvitation(reviewee.user_id);
      const isCooldown =
        !result.success &&
        "reason" in result &&
        result.reason === "cooldown";
      const message = isCooldown
        ? result.error
        : result.success
          ? (result.message ?? "Email invitation resent successfully.")
          : (result.error ?? "Unable to resend the email invitation.");

      onNotice(message);
      onClose();
    } catch {
      setError("Unable to resend the email invitation. Please try again.");
    } finally {
      isResendingRef.current = false;
      setIsResending(false);
    }
  };

  return {
    cancelButtonRef,
    dialogRef,
    error,
    handleClose,
    handleResend,
    isResending,
  };
};
