"use server";

import type {
  AdminQuestion,
  AdminQuestionOption,
} from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import { PAES_GAME_TYPE } from "@/features/app/admin/question-bank/constants/questionBank";
import { createAdminSubjectActionClient } from "@/features/app/admin/question-bank/utils/assertAdminSession";
import { assertPaesSubject } from "@/features/app/admin/question-bank/utils/assertPaesSubject";

type PaesQuestionSet = {
  id: number;
  questions: AdminQuestion[];
  subject_id: number;
};

export const fetchPaesSubjectQuestions = async (subjectId: number) => {
  try {
    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      throw new Error("A valid PAES Series subject is required");
    }

    const supabase = await createAdminSubjectActionClient();
    await assertPaesSubject(supabase, subjectId);

    const { data, error } = await supabase
      .from("question_sets")
      .select(
        "id, subject_id, questions(id, question_set_id, question_text, created_at, updated_at, question_options(id, question_id, option_text, is_correct, sort_order))",
      )
      .eq("subject_id", subjectId)
      .eq("game_type", PAES_GAME_TYPE)
      .is("difficulty", null)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    const questionSet = data as PaesQuestionSet | null;
    const questions = [...(questionSet?.questions ?? [])]
      .map((question) => ({
        ...question,
        question_options: [
          ...(question.question_options ?? ([] as AdminQuestionOption[])),
        ].sort(
          (firstOption, secondOption) =>
            firstOption.sort_order - secondOption.sort_order,
        ),
      }))
      .sort(
        (firstQuestion, secondQuestion) =>
          firstQuestion.id - secondQuestion.id,
      );

    return {
      success: true,
      questions,
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      questions: [] as AdminQuestion[],
      error:
        error instanceof Error
          ? error.message
          : "Unable to fetch PAES questions",
    };
  }
};
