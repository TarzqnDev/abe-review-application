import { useRef } from "react";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseFlashCardGameSummaryModalOptions = {
  isOpen: boolean;
  onClose: () => void;
};

export const useFlashCardGameSummaryModal = ({
  isOpen,
  onClose,
}: UseFlashCardGameSummaryModalOptions) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: closeButtonRef,
    isOpen,
    onClose,
  });

  return {
    closeButtonRef,
    modalAccessibility,
  };
};
