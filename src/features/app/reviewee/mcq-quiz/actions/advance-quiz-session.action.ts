"use server";

import type { QuizAdvancement } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertSessionId,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type AdvanceQuizSessionInput = {
  sessionId: string;
};

export const advanceQuizSession = async ({
  sessionId,
}: AdvanceQuizSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("advance_quiz_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      advancement: data as unknown as QuizAdvancement,
    };
  } catch (error: unknown) {
    return {
      success: false,
      advancement: null,
      error: getQuizActionError(error, "Unable to continue the quiz"),
    };
  }
};
