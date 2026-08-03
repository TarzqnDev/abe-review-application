import { useEffect, useRef } from "react";
import type { FlashCardSummary } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";
import { getGameSummaryPresentation } from "@/features/app/reviewee/utils/getGameSummaryPresentation";
import { useGameSounds } from "@/hooks/useGameSounds";

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
  const { playPerfectCelebration } = useGameSounds();
  const celebratedSessionIdRef = useRef<string | null>(null);
  const isPerfectResult = Boolean(
    summary &&
      summary.endReason === "completed" &&
      summary.status === "completed" &&
      summary.totalQuestions > 0 &&
      summary.accuracyPercentage === 100 &&
      summary.correct === summary.totalQuestions &&
      summary.incorrect === 0 &&
      summary.timedOut === 0 &&
      summary.notPlayed === 0,
  );

  useEffect(() => {
    if (
      !isOpen ||
      !summary ||
      !isPerfectResult ||
      celebratedSessionIdRef.current === summary.sessionId
    ) {
      return;
    }

    celebratedSessionIdRef.current = summary.sessionId;
    playPerfectCelebration();
  }, [
    isOpen,
    isPerfectResult,
    playPerfectCelebration,
    summary,
  ]);

  return {
    closeButtonRef,
    isPerfectResult,
    modalAccessibility,
    ...summaryPresentation,
  };
};
