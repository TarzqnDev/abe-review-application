"use server";

import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertSessionId,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type CancelQuizSessionInput = {
  sessionId: string;
};

type QuizCancellation = {
  sessionId: string;
  status: "cancelled";
};

export const cancelQuizSession = async ({
  sessionId,
}: CancelQuizSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("cancel_quiz_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      cancellation: data as unknown as QuizCancellation,
    };
  } catch (error: unknown) {
    return {
      success: false,
      cancellation: null,
      error: getQuizActionError(error, "Unable to cancel the quiz"),
    };
  }
};
