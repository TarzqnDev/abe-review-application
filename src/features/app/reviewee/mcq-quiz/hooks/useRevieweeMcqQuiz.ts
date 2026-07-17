import { useCallback, useState } from "react";
import type {
  PreparedQuizSession,
  QuizGameType,
  QuizQuestionTiming,
  QuizSummary,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type RevieweeMcqQuizStage =
  | "idle"
  | "selection"
  | "countdown"
  | "playing"
  | "summary";

export const useRevieweeMcqQuiz = () => {
  const [selectedGameType, setSelectedGameType] =
    useState<QuizGameType | null>(null);
  const [stage, setStage] = useState<RevieweeMcqQuizStage>("idle");
  const [preparedSession, setPreparedSession] =
    useState<PreparedQuizSession | null>(null);
  const [initialTiming, setInitialTiming] =
    useState<QuizQuestionTiming | null>(null);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [noQuestions, setNoQuestions] = useState({
    isOpen: false,
    message:
      "There are no questions available for this area and difficulty yet.",
  });

  const resetMcqQuizGame = useCallback(() => {
    setSelectedGameType(null);
    setStage("idle");
    setPreparedSession(null);
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
    setInitialTiming(null);
    setSummary(null);
    setStage("selection");
  }, []);

  const closeGameSelection = useCallback(() => {
    setSelectedGameType(null);
    setStage("idle");
  }, []);

  const handleSessionPrepared = useCallback((session: PreparedQuizSession) => {
    setPreparedSession(session);
    setStage("countdown");
  }, []);

  const handleNoQuestions = useCallback(() => {
    setNoQuestions((currentState) => ({
      ...currentState,
      isOpen: true,
    }));
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

  const handleGameStarted = useCallback((timing: QuizQuestionTiming) => {
    setInitialTiming(timing);
    setStage("playing");
  }, []);

  const handleGameFinished = useCallback((gameSummary: QuizSummary) => {
    setSummary(gameSummary);
    setStage("summary");
  }, []);

  return {
    closeGameSelection,
    closeNoQuestions,
    handleCountdownCancelled,
    handleGameFinished,
    handleGameStarted,
    handleNoQuestions,
    handleSessionPrepared,
    initialTiming,
    noQuestions,
    openGameSelection,
    preparedSession,
    resetMcqQuizGame,
    selectedGameType,
    stage,
    summary,
  };
};
