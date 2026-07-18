import { useRef } from "react";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";
import type { QuizSummary } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { getGameSummaryPresentation } from "@/features/app/reviewee/utils/getGameSummaryPresentation";

type UseGameSummaryModalOptions = {
  isOpen: boolean;
  onClose: () => void;
  summary: QuizSummary | null;
};

export const useGameSummaryModal = ({
  isOpen,
  onClose,
  summary,
}: UseGameSummaryModalOptions) => {
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
