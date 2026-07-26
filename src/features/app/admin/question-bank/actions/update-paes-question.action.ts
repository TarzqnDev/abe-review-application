"use server";

import { PAES_GAME_TYPE } from "@/features/app/admin/question-bank/constants/questionBank";
import { createAdminSubjectActionClient } from "@/features/app/admin/question-bank/utils/assertAdminSession";
import { assertPaesSubject } from "@/features/app/admin/question-bank/utils/assertPaesSubject";
import { validatePaesQuestionForm } from "@/features/app/admin/question-bank/utils/validatePaesQuestionForm";

export const updatePaesQuestion = async (formData: FormData) => {
  try {
    const questionId = Number(formData.get("questionId"));

    if (!Number.isInteger(questionId) || questionId <= 0) {
      throw new Error("A valid question is required");
    }

    const validatedForm = validatePaesQuestionForm(formData);
    const supabase = await createAdminSubjectActionClient();
    await assertPaesSubject(supabase, validatedForm.subjectId);

    const { data: existingQuestion, error: questionLookupError } = await supabase
      .from("questions")
      .select("question_sets!inner(game_type)")
      .eq("id", questionId)
      .single();

    if (questionLookupError) {
      throw new Error(questionLookupError.message);
    }

    const existingQuestionSet = Array.isArray(existingQuestion.question_sets)
      ? existingQuestion.question_sets[0]
      : existingQuestion.question_sets;

    if (existingQuestionSet?.game_type !== PAES_GAME_TYPE) {
      throw new Error("The selected question is not a PAES question");
    }

    const { data: questionSet, error: questionSetError } = await supabase
      .from("question_sets")
      .upsert(
        {
          difficulty: null,
          game_type: PAES_GAME_TYPE,
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
      message: "PAES question updated successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to update PAES question",
      error:
        error instanceof Error
          ? error.message
          : "Unable to update PAES question",
    };
  }
};
