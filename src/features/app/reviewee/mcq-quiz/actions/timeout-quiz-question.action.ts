"use server";

import type { QuizQuestionTimeout } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type TimeoutQuizQuestionInput = {
  sessionQuestionId: number;
};

export const timeoutQuizQuestion = async ({
  sessionQuestionId,
}: TimeoutQuizQuestionInput) => {
  try {
    assertPositiveInteger(sessionQuestionId, "quiz question");

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("timeout_quiz_question", {
      selected_session_question_id: sessionQuestionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      timeout: data as unknown as QuizQuestionTimeout,
    };
  } catch (error: unknown) {
    return {
      success: false,
      timeout: null,
      error: getQuizActionError(error, "Unable to finish the quiz question"),
    };
  }
};
