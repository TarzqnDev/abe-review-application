"use server";

import type { QuizArea } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import { getQuizActionError } from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export const fetchQuizAreas = async () => {
  try {
    const supabase = await createRevieweeQuizActionClient();
    const { data, error } = await supabase
      .from("subject_areas")
      .select("id, name")
      .neq("name", "PAES Series")
      .order("id");

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      areas: (data ?? []) satisfies QuizArea[],
    };
  } catch (error: unknown) {
    return {
      success: false,
      areas: [] as QuizArea[],
      error: getQuizActionError(error, "Unable to load quiz areas"),
    };
  }
};
