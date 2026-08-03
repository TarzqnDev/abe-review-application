import { useEffect, useRef } from "react";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";
import type { QuizSummary } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { getGameSummaryPresentation } from "@/features/app/reviewee/utils/getGameSummaryPresentation";
import { useGameSounds } from "@/hooks/useGameSounds";

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
  const celebratedSessionIdRef = useRef<string | null>(null);
  const { playPerfectCelebration } = useGameSounds();
  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: closeButtonRef,
    isOpen,
    onClose,
  });
  const summaryPresentation = getGameSummaryPresentation(summary);
  const isPerfectResult =
    summary?.endReason === "completed" &&
    summary.totalQuestions > 0 &&
    summary.correct === summary.totalQuestions &&
    summary.incorrect === 0 &&
    summary.timedOut === 0 &&
    summary.notPlayed === 0 &&
    summaryPresentation.scorePercentage === 100;

  useEffect(() => {
    if (
      !isOpen ||
      !isPerfectResult ||
      !summary ||
      celebratedSessionIdRef.current === summary.sessionId
    ) {
      return;
    }

    celebratedSessionIdRef.current = summary.sessionId;
    playPerfectCelebration();
  }, [isOpen, isPerfectResult, playPerfectCelebration, summary]);

  return {
    closeButtonRef,
    isPerfectResult,
    modalAccessibility,
    ...summaryPresentation,
  };
};
