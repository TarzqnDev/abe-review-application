"use server";

import type { QuizSessionPreview } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import {
  assertPositiveInteger,
  getQuizActionError,
} from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export type PreviewPaesQuizSessionInput = {
  subjectId: number;
};

type PreviewPaesQuizSessionPayload =
  | {
      status: "available";
      areaName: string;
      gameType: "PAES";
      difficulty: null;
      timerSeconds: number;
      totalQuestions: number;
    }
  | { status: "empty" };

export const previewPaesQuizSession = async ({
  subjectId,
}: PreviewPaesQuizSessionInput) => {
  try {
    assertPositiveInteger(subjectId, "PAES subject");

    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase.rpc("preview_paes_quiz_session", {
      selected_subject_id: subjectId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as PreviewPaesQuizSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to check this PAES quiz");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        preview: null,
        noQuestions: true,
      };
    }

    const preview: QuizSessionPreview = {
      selectionId: subjectId,
      areaName: payload.areaName,
      gameType: payload.gameType,
      difficulty: payload.difficulty,
      timerSeconds: payload.timerSeconds,
      totalQuestions: payload.totalQuestions,
    };

    return {
      success: true,
      preview,
    };
  } catch (error: unknown) {
    return {
      success: false,
      preview: null,
      error: getQuizActionError(error, "Unable to check this PAES quiz"),
    };
  }
};
