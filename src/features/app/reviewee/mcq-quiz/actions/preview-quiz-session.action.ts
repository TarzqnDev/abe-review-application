"use server";

import type {
  QuizDifficulty,
  QuizGameType,
  QuizSessionPreview,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
  isQuizDifficulty,
  isQuizGameType,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type PreviewQuizSessionInput = {
  areaId: number;
  gameType: QuizGameType;
  difficulty: QuizDifficulty;
};

type PreviewQuizSessionPayload =
  | {
      status: "available";
      areaName: string;
      gameType: QuizGameType;
      difficulty: QuizDifficulty;
      timerSeconds: number;
      totalQuestions: number;
    }
  | { status: "empty" };

export const previewQuizSession = async ({
  areaId,
  gameType,
  difficulty,
}: PreviewQuizSessionInput) => {
  try {
    assertPositiveInteger(areaId, "subject area");

    if (!isQuizGameType(gameType) || gameType === "PAES") {
      throw new Error("A valid game type is required");
    }

    if (!isQuizDifficulty(difficulty)) {
      throw new Error("A valid difficulty is required");
    }

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("preview_quiz_session", {
      selected_area_id: areaId,
      selected_difficulty: difficulty,
      selected_game_type: gameType,
    });

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as PreviewQuizSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to check this quiz");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        preview: null,
        noQuestions: true,
      };
    }

    const preview: QuizSessionPreview = {
      selectionId: areaId,
      areaName: payload.areaName,
      gameType,
      difficulty,
      timerSeconds: payload.timerSeconds,
      totalQuestions: payload.totalQuestions,
    };

    return {
      success: true,
      preview,
    };
  } catch (error: unknown) {
    return {
      success: false,
      preview: null,
      error: getQuizActionError(error, "Unable to check this quiz"),
    };
  }
};
