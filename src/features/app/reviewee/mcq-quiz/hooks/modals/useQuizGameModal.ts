import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { advanceQuizSession } from "@/features/app/reviewee/mcq-quiz/actions/advance-quiz-session.action";
import { revealQuizAnswer } from "@/features/app/reviewee/mcq-quiz/actions/reveal-quiz-answer.action";
import { submitQuizAnswer } from "@/features/app/reviewee/mcq-quiz/actions/submit-quiz-answer.action";
import { timeoutQuizQuestion } from "@/features/app/reviewee/mcq-quiz/actions/timeout-quiz-question.action";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";
import type {
  PreparedQuizSession,
  QuizAnswerReveal,
  QuizQuestionTiming,
  QuizSummary,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type QuizQuestionPhase =
  | "answering"
  | "checking"
  | "result"
  | "timeoutHold"
  | "transitioning";

type UseQuizGameModalOptions = {
  initialTiming: QuizQuestionTiming | null;
  isOpen: boolean;
  onFinished: (summary: QuizSummary) => void;
  preparedSession: PreparedQuizSession | null;
};

const QUESTION_FADE_DURATION_MS = 300;

const wait = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

export const useQuizGameModal = ({
  initialTiming,
  isOpen,
  onFinished,
  preparedSession,
}: UseQuizGameModalOptions) => {
  const answerDeadlineRef = useRef(0);
  const phaseDeadlineRef = useRef(0);
  const pausedAtRef = useRef<number | null>(null);
  const operationIdRef = useRef(0);
  const isActionInProgressRef = useRef(false);
  const timeoutRecordedRef = useRef(false);
  const serverOffsetRef = useRef(0);
  const [currentTiming, setCurrentTiming] =
    useState<QuizQuestionTiming | null>(initialTiming);
  const [phase, setPhase] = useState<QuizQuestionPhase>("answering");
  const [remainingSeconds, setRemainingSeconds] = useState(
    preparedSession?.timerSeconds ?? 0,
  );
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [answerReveal, setAnswerReveal] = useState<QuizAnswerReveal | null>(
    null,
  );
  const [error, setError] = useState("");
  const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [retryVersion, setRetryVersion] = useState(0);

  const handleRequestClose = useCallback(() => {
    if (isExitConfirmationOpen) return;
    pausedAtRef.current = Date.now();
    setIsExitConfirmationOpen(true);
  }, [isExitConfirmationOpen]);

  const modalAccessibility = useQuizModalAccessibility({
    isOpen,
    onClose: handleRequestClose,
  });

  const currentQuestion = useMemo(() => {
    if (!preparedSession || !currentTiming) return null;

    return (
      preparedSession.questions.find(
        (question) =>
          question.questionOrder === currentTiming.questionOrder,
      ) ?? null
    );
  }, [currentTiming, preparedSession]);

  const applyTiming = useCallback(
    (timing: QuizQuestionTiming) => {
      const serverNow = Date.parse(timing.serverNow);
      const serverDeadline = Date.parse(timing.deadlineAt);
      serverOffsetRef.current = serverNow - Date.now();
      answerDeadlineRef.current =
        serverDeadline - serverOffsetRef.current;
      phaseDeadlineRef.current = 0;
      timeoutRecordedRef.current = false;
      setCurrentTiming(timing);
      setRemainingSeconds(preparedSession?.timerSeconds ?? 0);
      setSelectedOptionId(null);
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
      setIsQuestionVisible(true);
    });

    return () => {
      operationIdRef.current += 1;
      isActionInProgressRef.current = false;
    };
  }, [applyTiming, initialTiming, isOpen]);

  const advanceToNextQuestion = useCallback(
    async (fallbackPhase: "result" | "timeoutHold") => {
      if (!preparedSession || isActionInProgressRef.current) return;

      isActionInProgressRef.current = true;
      setError("");
      setPhase("transitioning");
      setIsQuestionVisible(false);
      const activeOperationId = operationIdRef.current;

      await wait(QUESTION_FADE_DURATION_MS);
      const result = await advanceQuizSession({
        sessionId: preparedSession.sessionId,
      });

      if (operationIdRef.current !== activeOperationId) return;

      if (!result.success || !result.advancement) {
        setError(result.error ?? "Unable to load the next question.");
        setPhase(fallbackPhase);
        phaseDeadlineRef.current = Number.POSITIVE_INFINITY;
        setIsQuestionVisible(true);
        isActionInProgressRef.current = false;
        return;
      }

      if (result.advancement.completed) {
        if (result.advancement.summary) {
          onFinished(result.advancement.summary);
        } else {
          setError("The game ended without a summary.");
          setPhase(fallbackPhase);
          setIsQuestionVisible(true);
        }
        isActionInProgressRef.current = false;
        return;
      }

      if (!result.advancement.timing) {
        setError("Unable to load the next question.");
        setPhase(fallbackPhase);
        setIsQuestionVisible(true);
        isActionInProgressRef.current = false;
        return;
      }

      applyTiming(result.advancement.timing);
      requestAnimationFrame(() => setIsQuestionVisible(true));
      isActionInProgressRef.current = false;
    },
    [applyTiming, onFinished, preparedSession],
  );

  const resolveSubmittedAnswer = useCallback(async () => {
    if (!currentTiming || isActionInProgressRef.current) return;

    isActionInProgressRef.current = true;
    setError("");
    const activeOperationId = operationIdRef.current;
    const result = await revealQuizAnswer({
      sessionQuestionId: currentTiming.sessionQuestionId,
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

  const resolveTimedOutQuestion = useCallback(async () => {
    if (!currentTiming || isActionInProgressRef.current) return;

    if (timeoutRecordedRef.current) {
      await advanceToNextQuestion("timeoutHold");
      return;
    }

    isActionInProgressRef.current = true;
    setError("");
    const activeOperationId = operationIdRef.current;
    const result = await timeoutQuizQuestion({
      sessionQuestionId: currentTiming.sessionQuestionId,
    });

    if (operationIdRef.current !== activeOperationId) return;

    if (!result.success || !result.timeout) {
      setError(result.error ?? "Unable to record the timed-out question.");
      phaseDeadlineRef.current = Number.POSITIVE_INFINITY;
      isActionInProgressRef.current = false;
      return;
    }

    timeoutRecordedRef.current = true;
    isActionInProgressRef.current = false;
    await advanceToNextQuestion("timeoutHold");
  }, [advanceToNextQuestion, currentTiming]);

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
        void advanceToNextQuestion("result");
      } else if (phase === "timeoutHold") {
        void resolveTimedOutQuestion();
      }
    };

    updatePhase();
    const interval = setInterval(updatePhase, 100);
    return () => clearInterval(interval);
  }, [
    advanceToNextQuestion,
    currentTiming,
    isExitConfirmationOpen,
    isOpen,
    phase,
    resolveSubmittedAnswer,
    resolveTimedOutQuestion,
    retryVersion,
  ]);

  const handleSelectOption = (optionId: number) => {
    if (phase !== "answering") return;
    setSelectedOptionId(optionId);
    setError("");
  };

  const handleSubmitAnswer = async () => {
    if (
      !currentTiming ||
      selectedOptionId === null ||
      phase !== "answering" ||
      isActionInProgressRef.current
    ) {
      return;
    }

    isActionInProgressRef.current = true;
    setError("");
    setPhase("checking");
    phaseDeadlineRef.current = Date.now() + 3000;
    const result = await submitQuizAnswer({
      selectedOptionId,
      sessionQuestionId: currentTiming.sessionQuestionId,
    });

    if (!result.success || !result.submission) {
      setError(result.error ?? "Unable to submit your answer.");
      setPhase("answering");
      isActionInProgressRef.current = false;
      return;
    }

    const revealAt = Date.parse(result.submission.revealAt);
    phaseDeadlineRef.current =
      revealAt - serverOffsetRef.current;
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

  const handleExited = (summary: QuizSummary) => {
    operationIdRef.current += 1;
    setIsExitConfirmationOpen(false);
    onFinished(summary);
  };

  const handleRetry = () => {
    setError("");

    if (phase === "checking") {
      phaseDeadlineRef.current = Date.now();
    } else if (phase === "result" || phase === "timeoutHold") {
      phaseDeadlineRef.current = Date.now();
    }

    setRetryVersion((currentVersion) => currentVersion + 1);
  };

  return {
    answerReveal,
    currentQuestion,
    currentTiming,
    error,
    handleCancelExitConfirmation,
    handleExited,
    handleOpenExitConfirmation,
    handleRetry,
    handleSelectOption,
    handleSubmitAnswer,
    isExitConfirmationOpen,
    isQuestionVisible,
    modalAccessibility,
    phase,
    remainingSeconds,
    selectedOptionId,
  };
};
