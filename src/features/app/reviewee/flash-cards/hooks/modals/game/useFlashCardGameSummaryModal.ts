import { useRef } from "react";
import type { FlashCardSummary } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";
import { getGameSummaryPresentation } from "@/features/app/reviewee/utils/getGameSummaryPresentation";

type UseFlashCardGameSummaryModalOptions = {
  isOpen: boolean;
  onClose: () => void;
  summary: FlashCardSummary | null;
};

export const useFlashCardGameSummaryModal = ({
  isOpen,
  onClose,
  summary,
}: UseFlashCardGameSummaryModalOptions) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: closeButtonRef,
    isOpen,
    onClose,
  });
  const summaryPresentation = getGameSummaryPresentation(summary);

  return {
    closeButtonRef,
    modalAccessibility,
    ...summaryPresentation,
  };
};
