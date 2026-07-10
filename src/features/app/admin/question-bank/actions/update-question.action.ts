"use server";

import { createAdminSubjectActionClient } from "@/features/app/admin/question-bank/utils/assertAdminSession";
import { validateQuestionForm } from "@/features/app/admin/question-bank/utils/validateQuestionForm";

export const updateQuestion = async (formData: FormData) => {
  try {
    const questionId = Number(formData.get("questionId"));

    if (!Number.isInteger(questionId) || questionId <= 0) {
      throw new Error("A valid question is required");
    }

    const validatedForm = validateQuestionForm(formData);
    const supabase = await createAdminSubjectActionClient();

    const { data: questionSet, error: questionSetError } = await supabase
      .from("question_sets")
      .upsert(
        {
          difficulty: validatedForm.difficulty,
          game_type: validatedForm.gameType,
          subject_id: validatedForm.subjectId,
        },
        {
          onConflict: "subject_id,game_type,difficulty",
        },
      )
      .select("id")
      .single();

    if (questionSetError) {
      throw new Error(questionSetError.message);
    }

    const { error: questionError } = await supabase
      .from("questions")
      .update({
        question_set_id: questionSet.id,
        question_text: validatedForm.questionText,
      })
      .eq("id", questionId);

    if (questionError) {
      throw new Error(questionError.message);
    }

    const { error: deleteOptionsError } = await supabase
      .from("question_options")
      .delete()
      .eq("question_id", questionId);

    if (deleteOptionsError) {
      throw new Error(deleteOptionsError.message);
    }

    const { error: optionError } = await supabase
      .from("question_options")
      .insert(
        validatedForm.options.map((option) => ({
          ...option,
          question_id: questionId,
        })),
      );

    if (optionError) {
      throw new Error(optionError.message);
    }

    return {
      success: true,
      message: "Question updated successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to update question",
      error:
        error instanceof Error ? error.message : "Unable to update question",
    };
  }
};
