"use server";

import type {
  PreparedQuizSession,
  QuizQuestionTiming,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type StartPaesQuizSessionAfterCountdownInput = {
  subjectId: number;
};

type StartedPaesQuizSessionPayload =
  | {
      status: "started";
      preparedSession: PreparedQuizSession;
      timing: QuizQuestionTiming;
    }
  | { status: "empty" };

export const startPaesQuizSessionAfterCountdown = async ({
  subjectId,
}: StartPaesQuizSessionAfterCountdownInput) => {
  try {
    assertPositiveInteger(subjectId, "PAES subject");

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc(
      "start_paes_quiz_session_after_countdown",
      {
        selected_subject_id: subjectId,
      },
    );

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as StartedPaesQuizSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to start the PAES quiz");
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
      error: getQuizActionError(error, "Unable to start the PAES quiz"),
    };
  }
};
