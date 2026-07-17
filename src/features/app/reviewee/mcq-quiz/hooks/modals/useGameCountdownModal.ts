import { useCallback, useEffect, useRef, useState } from "react";
import { cancelQuizSession } from "@/features/app/reviewee/mcq-quiz/actions/cancel-quiz-session.action";
import { startQuizSession } from "@/features/app/reviewee/mcq-quiz/actions/start-quiz-session.action";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";
import type {
  PreparedQuizSession,
  QuizQuestionTiming,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

type UseGameCountdownModalOptions = {
  isOpen: boolean;
  onCancel: () => void;
  onStarted: (timing: QuizQuestionTiming) => void;
  preparedSession: PreparedQuizSession | null;
};

export const useGameCountdownModal = ({
  isOpen,
  onCancel,
  onStarted,
  preparedSession,
}: UseGameCountdownModalOptions) => {
  const actionInProgressRef = useRef(false);
  const cancelledRef = useRef(false);
  const countdownDeadlineRef = useRef(0);
  const [countdown, setCountdown] = useState(3);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const modalAccessibility = useQuizModalAccessibility({
    isOpen,
  });

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
    const result = await startQuizSession({
      sessionId: preparedSession.sessionId,
    });

    if (!result.success || !result.timing) {
      setError(result.error ?? "Unable to start the game.");
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

    const result = await cancelQuizSession({
      sessionId: preparedSession.sessionId,
    });

    if (!result.success) {
      cancelledRef.current = false;
      actionInProgressRef.current = false;
      setError(result.error ?? "Unable to cancel the game.");
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
