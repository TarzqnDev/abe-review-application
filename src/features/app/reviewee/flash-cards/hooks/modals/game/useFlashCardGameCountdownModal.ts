import { useCallback, useEffect, useRef, useState } from "react";
import { startFlashCardSessionAfterCountdown } from "@/features/app/reviewee/flash-cards/actions/game/start-flash-card-session-after-countdown.action";
import type {
  FlashCardCountdownDetails,
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseFlashCardGameCountdownModalOptions = {
  countdownDetails: FlashCardCountdownDetails | null;
  isOpen: boolean;
  onCancel: () => void;
  onNoFlashCards: () => void;
  onStarted: (
    preparedSession: PreparedFlashCardSession,
    timing: FlashCardTiming,
  ) => void;
};

export const useFlashCardGameCountdownModal = ({
  countdownDetails,
  isOpen,
  onCancel,
  onNoFlashCards,
  onStarted,
}: UseFlashCardGameCountdownModalOptions) => {
  const actionInProgressRef = useRef(false);
  const cancelledRef = useRef(false);
  const [countdown, setCountdown] = useState(3);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const modalAccessibility = useQuizModalAccessibility({ isOpen });

  const beginStart = useCallback(async () => {
    if (
      !countdownDetails ||
      cancelledRef.current ||
      actionInProgressRef.current
    ) {
      return;
    }

    actionInProgressRef.current = true;
    setError("");
    setIsStarting(true);
    const result = await startFlashCardSessionAfterCountdown({
      areaId: countdownDetails.areaId,
    });

    if (cancelledRef.current) return;

    if (!result.success) {
      setError(result.error ?? "Unable to start the flash card game.");
      actionInProgressRef.current = false;
      setIsStarting(false);
      return;
    }

    if (
      result.noFlashCards ||
      !result.preparedSession ||
      !result.timing
    ) {
      onNoFlashCards();
      return;
    }

    onStarted(result.preparedSession, result.timing);
  }, [countdownDetails, onNoFlashCards, onStarted]);

  useEffect(() => {
    if (!isOpen || !countdownDetails) return;

    const countdownStartedAt = Date.now();
    cancelledRef.current = false;
    actionInProgressRef.current = false;
    void Promise.resolve().then(() => {
      setCountdown(3);
      setError("");
      setIsStarting(false);
    });

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (Date.now() - countdownStartedAt) / 1000,
      );
      setCountdown(Math.max(0, 3 - elapsedSeconds));
    }, 100);

    const startTimeout = setTimeout(() => {
      void beginStart();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(startTimeout);
    };
  }, [beginStart, countdownDetails, isOpen]);

  const handleCancel = () => {
    if (!countdownDetails || isStarting || actionInProgressRef.current) {
      return;
    }

    cancelledRef.current = true;
    onCancel();
  };

  return {
    countdown,
    error,
    handleCancel,
    isStarting,
    modalAccessibility,
  };
};
