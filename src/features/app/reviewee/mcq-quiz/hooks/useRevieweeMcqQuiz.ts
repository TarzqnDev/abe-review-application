import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRevieweeMcqQuizPageData } from "@/features/app/reviewee/mcq-quiz/actions/fetch-reviewee-mcq-quiz-page-data.action";
import type {
  PreparedQuizSession,
  QuizGameType,
  QuizQuestionTiming,
  QuizSessionPreview,
  QuizSummary,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { useTodaysTriviaCard } from "@/features/app/reviewee/trivia/hooks/useTodaysTriviaCard";

export type RevieweeMcqQuizStage =
  | "idle"
  | "selection"
  | "countdown"
  | "playing"
  | "summary";

const DEFAULT_NO_QUESTIONS_MESSAGE =
  "There are no questions available for this area and difficulty yet.";

export const useRevieweeMcqQuiz = () => {
  const hasStartedInitialLoadRef = useRef(false);
  const todaysTriviaCard = useTodaysTriviaCard();
  const { applyTriviaResult, beginTriviaRequest } = todaysTriviaCard;
  const [isLoadingInitialPageData, setIsLoadingInitialPageData] =
    useState(true);
  const [selectedGameType, setSelectedGameType] =
    useState<QuizGameType | null>(null);
  const [stage, setStage] = useState<RevieweeMcqQuizStage>("idle");
  const [preparedSession, setPreparedSession] =
    useState<PreparedQuizSession | null>(null);
  const [sessionPreview, setSessionPreview] =
    useState<QuizSessionPreview | null>(null);
  const [initialTiming, setInitialTiming] =
    useState<QuizQuestionTiming | null>(null);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [noQuestions, setNoQuestions] = useState({
    isOpen: false,
    message: DEFAULT_NO_QUESTIONS_MESSAGE,
  });

  useEffect(() => {
    if (hasStartedInitialLoadRef.current) return;

    hasStartedInitialLoadRef.current = true;
    const triviaRequestId = beginTriviaRequest(true);

    void Promise.resolve().then(async () => {
      try {
        const result = await fetchRevieweeMcqQuizPageData();
        applyTriviaResult(triviaRequestId, result.todaysTrivia);
      } catch {
        applyTriviaResult(triviaRequestId, {
          success: false,
          error: "Unable to load today's trivia.",
          trivia: null,
        });
      } finally {
        setIsLoadingInitialPageData(false);
      }
    });
  }, [applyTriviaResult, beginTriviaRequest]);

  const resetMcqQuizGame = useCallback(() => {
    setSelectedGameType(null);
    setStage("idle");
    setPreparedSession(null);
    setSessionPreview(null);
    setInitialTiming(null);
    setSummary(null);
    setNoQuestions((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  }, []);

  const openGameSelection = useCallback((gameType: QuizGameType) => {
    setSelectedGameType(gameType);
    setPreparedSession(null);
    setSessionPreview(null);
    setInitialTiming(null);
    setSummary(null);
    setStage("selection");
  }, []);

  const closeGameSelection = useCallback(() => {
    setSelectedGameType(null);
    setStage("idle");
  }, []);

  const handleSessionPreviewed = useCallback((preview: QuizSessionPreview) => {
    setSessionPreview(preview);
    setStage("countdown");
  }, []);

  const handleNoQuestions = useCallback((message?: string) => {
    setNoQuestions({
      isOpen: true,
      message: message ?? DEFAULT_NO_QUESTIONS_MESSAGE,
    });
  }, []);

  const closeNoQuestions = useCallback(() => {
    setNoQuestions((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  }, []);

  const handleCountdownCancelled = useCallback(() => {
    resetMcqQuizGame();
  }, [resetMcqQuizGame]);

  const handleCountdownNoQuestions = useCallback((message?: string) => {
    setSelectedGameType(null);
    setSessionPreview(null);
    setStage("idle");
    setNoQuestions({
      isOpen: true,
      message: message ?? DEFAULT_NO_QUESTIONS_MESSAGE,
    });
  }, []);

  const handleGameStarted = useCallback(
    (session: PreparedQuizSession, timing: QuizQuestionTiming) => {
      setPreparedSession(session);
      setInitialTiming(timing);
      setStage("playing");
    },
    [],
  );

  const handleGameFinished = useCallback((gameSummary: QuizSummary) => {
    setSummary(gameSummary);
    setStage("summary");
  }, []);

  return {
    closeGameSelection,
    closeNoQuestions,
    handleCountdownCancelled,
    handleCountdownNoQuestions,
    handleGameFinished,
    handleGameStarted,
    handleNoQuestions,
    handleSessionPreviewed,
    initialTiming,
    isLoadingInitialPageData,
    noQuestions,
    openGameSelection,
    preparedSession,
    resetMcqQuizGame,
    selectedGameType,
    sessionPreview,
    stage,
    summary,
    todaysTriviaCard,
  };
};
