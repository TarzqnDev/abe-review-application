"use server";

import type { QuizAnswerSubmission } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type SubmitQuizAnswerInput = {
  sessionQuestionId: number;
  selectedOptionId: number;
};

export const submitQuizAnswer = async ({
  sessionQuestionId,
  selectedOptionId,
}: SubmitQuizAnswerInput) => {
  try {
    assertPositiveInteger(sessionQuestionId, "quiz question");
    assertPositiveInteger(selectedOptionId, "answer");

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("submit_quiz_answer", {
      selected_option_id: selectedOptionId,
      selected_session_question_id: sessionQuestionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      submission: data as unknown as QuizAnswerSubmission,
    };
  } catch (error: unknown) {
    return {
      success: false,
      submission: null,
      error: getQuizActionError(error, "Unable to submit the answer"),
    };
  }
};
