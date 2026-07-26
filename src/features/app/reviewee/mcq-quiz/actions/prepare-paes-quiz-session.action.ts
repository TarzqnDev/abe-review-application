"use server";

import type { PreparedQuizSession } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type PreparePaesQuizSessionInput = {
  subjectId: number;
};

type PreparePaesQuizSessionPayload =
  | ({ status: "prepared" } & PreparedQuizSession)
  | { status: "empty" };

export const preparePaesQuizSession = async ({
  subjectId,
}: PreparePaesQuizSessionInput) => {
  try {
    assertPositiveInteger(subjectId, "PAES subject");

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("prepare_paes_quiz_session", {
      selected_subject_id: subjectId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as PreparePaesQuizSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to prepare the PAES quiz");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        preparedSession: null,
        noQuestions: true,
      };
    }

    return {
      success: true,
      preparedSession: payload as PreparedQuizSession,
    };
  } catch (error: unknown) {
    return {
      success: false,
      preparedSession: null,
      error: getQuizActionError(error, "Unable to prepare the PAES quiz"),
    };
  }
};
