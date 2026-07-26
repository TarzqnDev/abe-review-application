"use server";

import type { QuizSubject } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import { getQuizActionError } from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

export const fetchPaesSubjects = async () => {
  try {
    const supabase = await createRevieweeQuizActionClient();
    const { data: paesArea, error: paesAreaError } = await supabase
      .from("subject_areas")
      .select("id")
      .eq("name", "PAES Series")
      .maybeSingle();

    if (paesAreaError) {
      throw new Error(paesAreaError.message);
    }

    if (!paesArea) {
      return {
        success: true,
        subjects: [] as QuizSubject[],
      };
    }

    const { data, error } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("area_id", paesArea.id)
      .order("name");

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      subjects: (data ?? []) satisfies QuizSubject[],
    };
  } catch (error: unknown) {
    return {
      success: false,
      subjects: [] as QuizSubject[],
      error: getQuizActionError(error, "Unable to load PAES subjects"),
    };
  }
};
