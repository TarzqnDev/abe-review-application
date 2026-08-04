import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { getPaymentProofUrl } from "@/features/app/admin/manage-reviewees/actions/get-payment-proof-url.action";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type ProofOfPaymentModalOptions = {
  imagePath: string | null;
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  sourceImageUrl?: string;
};

export const useProofOfPaymentModal = ({
  imagePath,
  isOpen,
  onClose,
  returnFocusRef,
  sourceImageUrl,
}: ProofOfPaymentModalOptions) => {
  const [paymentProof, setPaymentProof] = useState<{
    imagePath: string;
    imageUrl: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const returnFocusElement =
      returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    const focusFrame = window.requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
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

  useEffect(() => {
    let isCurrentRequest = true;
    void Promise.resolve().then(async () => {
      if (!isCurrentRequest) return;

      setError("");
      if (!isOpen || sourceImageUrl || !imagePath) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const result = await getPaymentProofUrl(imagePath);
      if (!isCurrentRequest) return;
      if (result.success && result.signedUrl) {
        setPaymentProof({ imagePath, imageUrl: result.signedUrl });
      }
      else setError(result.error ?? "Unable to load proof of payment.");
      setIsLoading(false);
    });

    return () => { isCurrentRequest = false; };
  }, [imagePath, isOpen, sourceImageUrl]);

  const imageUrl =
    sourceImageUrl ||
    (paymentProof?.imagePath === imagePath ? paymentProof.imageUrl : "");

  return {
    closeButtonRef,
    dialogRef,
    error: sourceImageUrl ? "" : error,
    handleClose,
    imageUrl,
    isLoading: sourceImageUrl ? false : isLoading,
  };
};
