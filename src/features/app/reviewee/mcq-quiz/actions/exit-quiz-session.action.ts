"use server";

import type { QuizSummary } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertSessionId,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type ExitQuizSessionInput = {
  sessionId: string;
};

export const exitQuizSession = async ({
  sessionId,
}: ExitQuizSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("exit_quiz_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      summary: data as unknown as QuizSummary,
    };
  } catch (error: unknown) {
    return {
      success: false,
      summary: null,
      error: getQuizActionError(error, "Unable to exit the quiz"),
    };
  }
};
