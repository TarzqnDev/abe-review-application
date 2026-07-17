"use server";

import type {
  PreparedQuizSession,
  QuizDifficulty,
  QuizGameType,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
  isQuizDifficulty,
  isQuizGameType,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type PrepareQuizSessionInput = {
  areaId: number;
  gameType: QuizGameType;
  difficulty: QuizDifficulty;
};

type PrepareQuizSessionPayload =
  | ({ status: "prepared" } & PreparedQuizSession)
  | { status: "empty" };

export const prepareQuizSession = async ({
  areaId,
  gameType,
  difficulty,
}: PrepareQuizSessionInput) => {
  try {
    assertPositiveInteger(areaId, "subject area");

    if (!isQuizGameType(gameType)) {
      throw new Error("A valid game type is required");
    }

    if (!isQuizDifficulty(difficulty)) {
      throw new Error("A valid difficulty is required");
    }

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("prepare_quiz_session", {
      selected_area_id: areaId,
      selected_difficulty: difficulty,
      selected_game_type: gameType,
    });

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as PrepareQuizSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to prepare the quiz");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        preparedSession: null,
        noQuestions: true,
      };
    }

    const preparedSession: PreparedQuizSession = {
      sessionId: payload.sessionId,
      areaId: payload.areaId,
      areaName: payload.areaName,
      gameType: payload.gameType,
      difficulty: payload.difficulty,
      timerSeconds: payload.timerSeconds,
      totalQuestions: payload.totalQuestions,
      questions: payload.questions,
    };

    return {
      success: true,
      preparedSession,
    };
  } catch (error: unknown) {
    return {
      success: false,
      preparedSession: null,
      error: getQuizActionError(error, "Unable to prepare the quiz"),
    };
  }
};
