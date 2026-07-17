import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { advanceFlashCardSession } from "@/features/app/reviewee/flash-cards/actions/game/advance-flash-card-session.action";
import { revealFlashCardAnswer } from "@/features/app/reviewee/flash-cards/actions/game/reveal-flash-card-answer.action";
import { submitFlashCardAnswer } from "@/features/app/reviewee/flash-cards/actions/game/submit-flash-card-answer.action";
import { timeoutFlashCard } from "@/features/app/reviewee/flash-cards/actions/game/timeout-flash-card.action";
import type {
  FlashCardAnswerReveal,
  FlashCardSummary,
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

export type FlashCardGamePhase =
  | "answering"
  | "checking"
  | "result"
  | "timeoutHold"
  | "transitioning";

type UseFlashCardGameModalOptions = {
  initialTiming: FlashCardTiming | null;
  isOpen: boolean;
  onFinished: (summary: FlashCardSummary) => void;
  preparedSession: PreparedFlashCardSession | null;
};

const CARD_FADE_DURATION_MS = 300;

const wait = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

export const useFlashCardGameModal = ({
  initialTiming,
  isOpen,
  onFinished,
  preparedSession,
}: UseFlashCardGameModalOptions) => {
  const answerInputRef = useRef<HTMLTextAreaElement>(null);
  const answerDeadlineRef = useRef(0);
  const phaseDeadlineRef = useRef(0);
  const pausedAtRef = useRef<number | null>(null);
  const operationIdRef = useRef(0);
  const isActionInProgressRef = useRef(false);
  const timeoutRecordedRef = useRef(false);
  const serverOffsetRef = useRef(0);
  const [currentTiming, setCurrentTiming] =
    useState<FlashCardTiming | null>(initialTiming);
  const [phase, setPhase] = useState<FlashCardGamePhase>("answering");
  const [remainingSeconds, setRemainingSeconds] = useState(
    preparedSession?.timerSeconds ?? 0,
  );
  const [answer, setAnswer] = useState("");
  const [answerReveal, setAnswerReveal] =
    useState<FlashCardAnswerReveal | null>(null);
  const [error, setError] = useState("");
  const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false);
  const [isFlashCardVisible, setIsFlashCardVisible] = useState(true);
  const [retryVersion, setRetryVersion] = useState(0);

  const handleRequestClose = useCallback(() => {
    if (isExitConfirmationOpen) return;
    pausedAtRef.current = Date.now();
    setIsExitConfirmationOpen(true);
  }, [isExitConfirmationOpen]);

  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: answerInputRef,
    isOpen,
    onClose: handleRequestClose,
  });

  const currentFlashCard = useMemo(() => {
    if (!preparedSession || !currentTiming) return null;

    return (
      preparedSession.flashCards.find(
        (flashCard) => flashCard.cardOrder === currentTiming.cardOrder,
      ) ?? null
    );
  }, [currentTiming, preparedSession]);

  const applyTiming = useCallback(
    (timing: FlashCardTiming) => {
      const serverNow = Date.parse(timing.serverNow);
      const serverDeadline = Date.parse(timing.deadlineAt);
      serverOffsetRef.current = serverNow - Date.now();
      answerDeadlineRef.current = serverDeadline - serverOffsetRef.current;
      phaseDeadlineRef.current = 0;
      timeoutRecordedRef.current = false;
      setCurrentTiming(timing);
      setRemainingSeconds(preparedSession?.timerSeconds ?? 0);
      setAnswer("");
      setAnswerReveal(null);
      setError("");
      setPhase("answering");
    },
    [preparedSession?.timerSeconds],
  );

  useEffect(() => {
    if (!isOpen || !initialTiming) return;

    operationIdRef.current += 1;
    void Promise.resolve().then(() => {
      applyTiming(initialTiming);
      setIsExitConfirmationOpen(false);
      setIsFlashCardVisible(true);
    });

    return () => {
      operationIdRef.current += 1;
      isActionInProgressRef.current = false;
    };
  }, [applyTiming, initialTiming, isOpen]);

  useEffect(() => {
    if (!isOpen || phase !== "answering" || !isFlashCardVisible) return;

    const focusFrame = requestAnimationFrame(() => answerInputRef.current?.focus());
    return () => cancelAnimationFrame(focusFrame);
  }, [currentTiming, isFlashCardVisible, isOpen, phase]);

  const advanceToNextFlashCard = useCallback(
    async (fallbackPhase: "result" | "timeoutHold") => {
      if (!preparedSession || isActionInProgressRef.current) return;

      isActionInProgressRef.current = true;
      setError("");
      setPhase("transitioning");
      setIsFlashCardVisible(false);
      const activeOperationId = operationIdRef.current;

      await wait(CARD_FADE_DURATION_MS);
      const result = await advanceFlashCardSession({
        sessionId: preparedSession.sessionId,
      });

      if (operationIdRef.current !== activeOperationId) return;

      if (!result.success || !result.advancement) {
        setError(result.error ?? "Unable to load the next flash card.");
        setPhase(fallbackPhase);
        phaseDeadlineRef.current = Number.POSITIVE_INFINITY;
        setIsFlashCardVisible(true);
        isActionInProgressRef.current = false;
        return;
      }

      if (result.advancement.completed) {
        if (result.advancement.summary) {
          onFinished(result.advancement.summary);
        } else {
          setError("The game ended without a summary.");
          setPhase(fallbackPhase);
          setIsFlashCardVisible(true);
        }
        isActionInProgressRef.current = false;
        return;
      }

      if (!result.advancement.timing) {
        setError("Unable to load the next flash card.");
        setPhase(fallbackPhase);
        setIsFlashCardVisible(true);
        isActionInProgressRef.current = false;
        return;
      }

      applyTiming(result.advancement.timing);
      requestAnimationFrame(() => setIsFlashCardVisible(true));
      isActionInProgressRef.current = false;
    },
    [applyTiming, onFinished, preparedSession],
  );

  const resolveSubmittedAnswer = useCallback(async () => {
    if (!currentTiming || isActionInProgressRef.current) return;

    isActionInProgressRef.current = true;
    setError("");
    const activeOperationId = operationIdRef.current;
    const result = await revealFlashCardAnswer({
      sessionFlashCardId: currentTiming.sessionFlashCardId,
    });

    if (operationIdRef.current !== activeOperationId) return;

    if (!result.success || !result.answer) {
      setError(result.error ?? "Unable to check your answer.");
      phaseDeadlineRef.current = Number.POSITIVE_INFINITY;
      isActionInProgressRef.current = false;
      return;
    }

    setAnswerReveal(result.answer);
    setPhase("result");
    phaseDeadlineRef.current = Date.now() + 3000;
    isActionInProgressRef.current = false;
  }, [currentTiming]);

  const resolveTimedOutFlashCard = useCallback(async () => {
    if (!currentTiming || isActionInProgressRef.current) return;

    if (timeoutRecordedRef.current) {
      await advanceToNextFlashCard("timeoutHold");
      return;
    }

    isActionInProgressRef.current = true;
    setError("");
    const activeOperationId = operationIdRef.current;
    const result = await timeoutFlashCard({
      sessionFlashCardId: currentTiming.sessionFlashCardId,
    });

    if (operationIdRef.current !== activeOperationId) return;

    if (!result.success || !result.timeout) {
      setError(result.error ?? "Unable to record the timed-out flash card.");
      phaseDeadlineRef.current = Number.POSITIVE_INFINITY;
      isActionInProgressRef.current = false;
      return;
    }

    timeoutRecordedRef.current = true;
    isActionInProgressRef.current = false;
    await advanceToNextFlashCard("timeoutHold");
  }, [advanceToNextFlashCard, currentTiming]);

  useEffect(() => {
    if (
      !isOpen ||
      !currentTiming ||
      isExitConfirmationOpen ||
      phase === "transitioning"
    ) {
      return;
    }

    const updatePhase = () => {
      const now = Date.now();

      if (phase === "answering") {
        const secondsUntilDeadline = Math.max(
          0,
          Math.ceil((answerDeadlineRef.current - now) / 1000),
        );
        setRemainingSeconds(secondsUntilDeadline);

        if (secondsUntilDeadline === 0) {
          setPhase("timeoutHold");
          phaseDeadlineRef.current = now + 2000;
        }
        return;
      }

      if (now < phaseDeadlineRef.current) return;

      if (phase === "checking") {
        void resolveSubmittedAnswer();
      } else if (phase === "result") {
        void advanceToNextFlashCard("result");
      } else if (phase === "timeoutHold") {
        void resolveTimedOutFlashCard();
      }
    };

    updatePhase();
    const interval = setInterval(updatePhase, 100);
    return () => clearInterval(interval);
  }, [
    advanceToNextFlashCard,
    currentTiming,
    isExitConfirmationOpen,
    isOpen,
    phase,
    resolveSubmittedAnswer,
    resolveTimedOutFlashCard,
    retryVersion,
  ]);

  const handleAnswerChange = (value: string) => {
    if (phase !== "answering") return;
    setAnswer(value);
    setError("");
  };

  const handleSubmitAnswer = async () => {
    const submittedAnswer = answer.trim();

    if (
      !currentTiming ||
      !submittedAnswer ||
      phase !== "answering" ||
      isActionInProgressRef.current
    ) {
      return;
    }

    isActionInProgressRef.current = true;
    setError("");
    setPhase("checking");
    phaseDeadlineRef.current = Date.now() + 3000;
    const result = await submitFlashCardAnswer({
      answer: submittedAnswer,
      sessionFlashCardId: currentTiming.sessionFlashCardId,
    });

    if (!result.success || !result.submission) {
      setError(result.error ?? "Unable to submit your answer.");
      setPhase("answering");
      isActionInProgressRef.current = false;
      return;
    }

    const revealAt = Date.parse(result.submission.revealAt);
    phaseDeadlineRef.current = revealAt - serverOffsetRef.current;
    isActionInProgressRef.current = false;
  };

  const handleOpenExitConfirmation = handleRequestClose;

  const handleCancelExitConfirmation = () => {
    if (pausedAtRef.current !== null) {
      const pausedDuration = Date.now() - pausedAtRef.current;

      if (
        phase !== "answering" &&
        Number.isFinite(phaseDeadlineRef.current) &&
        phaseDeadlineRef.current > 0
      ) {
        phaseDeadlineRef.current += pausedDuration;
      }
    }

    pausedAtRef.current = null;
    setIsExitConfirmationOpen(false);
  };

  const handleExited = (summary: FlashCardSummary) => {
    operationIdRef.current += 1;
    setIsExitConfirmationOpen(false);
    onFinished(summary);
  };

  const handleRetry = () => {
    setError("");

    if (
      phase === "checking" ||
      phase === "result" ||
      phase === "timeoutHold"
    ) {
      phaseDeadlineRef.current = Date.now();
    }

    setRetryVersion((currentVersion) => currentVersion + 1);
  };

  return {
    answer,
    answerInputRef,
    answerReveal,
    currentFlashCard,
    currentTiming,
    error,
    handleAnswerChange,
    handleCancelExitConfirmation,
    handleExited,
    handleOpenExitConfirmation,
    handleRetry,
    handleSubmitAnswer,
    isExitConfirmationOpen,
    isFlashCardVisible,
    modalAccessibility,
    phase,
    remainingSeconds,
  };
};
