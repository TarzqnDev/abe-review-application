import { useCallback, useEffect, useRef, useState } from "react";
import { cancelFlashCardSession } from "@/features/app/reviewee/flash-cards/actions/game/cancel-flash-card-session.action";
import { startFlashCardSession } from "@/features/app/reviewee/flash-cards/actions/game/start-flash-card-session.action";
import type {
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseFlashCardGameCountdownModalOptions = {
  isOpen: boolean;
  onCancel: () => void;
  onStarted: (timing: FlashCardTiming) => void;
  preparedSession: PreparedFlashCardSession | null;
};

export const useFlashCardGameCountdownModal = ({
  isOpen,
  onCancel,
  onStarted,
  preparedSession,
}: UseFlashCardGameCountdownModalOptions) => {
  const actionInProgressRef = useRef(false);
  const cancelledRef = useRef(false);
  const countdownDeadlineRef = useRef(0);
  const [countdown, setCountdown] = useState(3);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const modalAccessibility = useQuizModalAccessibility({ isOpen });

  const beginStart = useCallback(async () => {
    if (
      !preparedSession ||
      cancelledRef.current ||
      actionInProgressRef.current
    ) {
      return;
    }

    actionInProgressRef.current = true;
    setError("");
    setIsStarting(true);
    const result = await startFlashCardSession({
      sessionId: preparedSession.sessionId,
    });

    if (!result.success || !result.timing) {
      setError(result.error ?? "Unable to start the flash card game.");
      actionInProgressRef.current = false;
      setIsStarting(false);
      return;
    }

    onStarted(result.timing);
  }, [onStarted, preparedSession]);

  useEffect(() => {
    if (!isOpen || !preparedSession) return;

    const countdownStartedAt = Date.now();
    countdownDeadlineRef.current = countdownStartedAt + 3000;
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
  }, [beginStart, isOpen, preparedSession]);

  const handleCancel = async () => {
    if (
      !preparedSession ||
      isCancelling ||
      isStarting ||
      actionInProgressRef.current
    ) {
      return;
    }

    actionInProgressRef.current = true;
    cancelledRef.current = true;
    setIsCancelling(true);
    setError("");
    const result = await cancelFlashCardSession({
      sessionId: preparedSession.sessionId,
    });

    if (!result.success) {
      cancelledRef.current = false;
      actionInProgressRef.current = false;
      setError(result.error ?? "Unable to cancel the flash card game.");
      setIsCancelling(false);

      if (Date.now() >= countdownDeadlineRef.current) {
        void beginStart();
      }

      return;
    }

    onCancel();
    setIsCancelling(false);
  };

  return {
    countdown,
    error,
    handleCancel,
    isCancelling,
    isStarting,
    modalAccessibility,
  };
};
