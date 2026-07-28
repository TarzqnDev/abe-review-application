"use server";

import type {
  PreparedQuizSession,
  QuizDifficulty,
  QuizGameType,
  QuizQuestionTiming,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
  isQuizDifficulty,
  isQuizGameType,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type StartQuizSessionAfterCountdownInput = {
  areaId: number;
  gameType: QuizGameType;
  difficulty: QuizDifficulty;
};

type StartedQuizSessionPayload =
  | {
      status: "started";
      preparedSession: PreparedQuizSession;
      timing: QuizQuestionTiming;
    }
  | { status: "empty" };

export const startQuizSessionAfterCountdown = async ({
  areaId,
  gameType,
  difficulty,
}: StartQuizSessionAfterCountdownInput) => {
  try {
    assertPositiveInteger(areaId, "subject area");

    if (!isQuizGameType(gameType) || gameType === "PAES") {
      throw new Error("A valid game type is required");
    }

    if (!isQuizDifficulty(difficulty)) {
      throw new Error("A valid difficulty is required");
    }

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc(
      "start_quiz_session_after_countdown",
      {
        selected_area_id: areaId,
        selected_difficulty: difficulty,
        selected_game_type: gameType,
      },
    );

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as StartedQuizSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to start the quiz");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        noQuestions: true,
        preparedSession: null,
        timing: null,
      };
    }

    return {
      success: true,
      preparedSession: payload.preparedSession,
      timing: payload.timing,
    };
  } catch (error: unknown) {
    return {
      success: false,
      preparedSession: null,
      timing: null,
      error: getQuizActionError(error, "Unable to start the quiz"),
    };
  }
};
