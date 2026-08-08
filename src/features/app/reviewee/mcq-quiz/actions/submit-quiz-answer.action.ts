"use server";

import type { QuizAnswerSubmission } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertIsoDateTime,
  assertPositiveInteger,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type SubmitQuizAnswerInput = {
  sessionQuestionId: number;
  selectedOptionId: number;
  submittedAt: string;
};

export const submitQuizAnswer = async ({
  sessionQuestionId,
  selectedOptionId,
  submittedAt,
}: SubmitQuizAnswerInput) => {
  try {
    assertPositiveInteger(sessionQuestionId, "quiz question");
    assertPositiveInteger(selectedOptionId, "answer");
    assertIsoDateTime(submittedAt, "answer submission time");

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("submit_quiz_answer", {
      client_submitted_at: submittedAt,
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
