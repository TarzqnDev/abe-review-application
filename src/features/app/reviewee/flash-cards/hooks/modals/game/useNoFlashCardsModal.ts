import { useEffect, useRef } from "react";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseNoFlashCardsModalOptions = {
  isOpen: boolean;
  onClose: () => void;
};

export const useNoFlashCardsModal = ({
  isOpen,
  onClose,
}: UseNoFlashCardsModalOptions) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: closeButtonRef,
    isOpen,
    onClose,
  });

  useEffect(() => {
    if (!isOpen) return;

    const closeTimeout = setTimeout(onClose, 4000);
    return () => clearTimeout(closeTimeout);
  }, [isOpen, onClose]);

  return {
    closeButtonRef,
    modalAccessibility,
  };
};
