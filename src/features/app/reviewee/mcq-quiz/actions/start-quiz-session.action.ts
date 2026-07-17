"use server";

import type { QuizQuestionTiming } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertSessionId,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type StartQuizSessionInput = {
  sessionId: string;
};

export const startQuizSession = async ({
  sessionId,
}: StartQuizSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("start_quiz_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      timing: data as unknown as QuizQuestionTiming,
    };
  } catch (error: unknown) {
    return {
      success: false,
      timing: null,
      error: getQuizActionError(error, "Unable to start the quiz"),
    };
  }
};
