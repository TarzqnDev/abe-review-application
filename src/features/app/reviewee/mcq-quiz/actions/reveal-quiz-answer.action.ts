"use server";

import type { QuizAnswerReveal } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type RevealQuizAnswerInput = {
  sessionQuestionId: number;
};

export const revealQuizAnswer = async ({
  sessionQuestionId,
}: RevealQuizAnswerInput) => {
  try {
    assertPositiveInteger(sessionQuestionId, "quiz question");

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("reveal_quiz_answer", {
      selected_session_question_id: sessionQuestionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      answer: data as unknown as QuizAnswerReveal,
    };
  } catch (error: unknown) {
    return {
      success: false,
      answer: null,
      error: getQuizActionError(error, "Unable to reveal the answer"),
    };
  }
};
