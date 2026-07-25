import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type DeactivateRevieweeConfirmationModalOptions = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
};

export const useDeactivateRevieweeConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  returnFocusRef,
}: DeactivateRevieweeConfirmationModalOptions) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const returnFocusElement = returnFocusRef.current;
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
      returnFocusElement?.focus();
    };
  }, [handleClose, isOpen, returnFocusRef]);

  return {
    cancelButtonRef,
    dialogRef,
    handleClose,
    handleConfirm: onConfirm,
  };
};
