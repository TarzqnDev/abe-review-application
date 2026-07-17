import { useRef } from "react";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseGameSummaryModalOptions = {
  isOpen: boolean;
  onClose: () => void;
};

export const useGameSummaryModal = ({
  isOpen,
  onClose,
}: UseGameSummaryModalOptions) => {
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
