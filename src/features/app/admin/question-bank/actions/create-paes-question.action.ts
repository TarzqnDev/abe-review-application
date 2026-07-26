"use server";

import { PAES_GAME_TYPE } from "@/features/app/admin/question-bank/constants/questionBank";
import { createAdminSubjectActionClient } from "@/features/app/admin/question-bank/utils/assertAdminSession";
import { assertPaesSubject } from "@/features/app/admin/question-bank/utils/assertPaesSubject";
import { validatePaesQuestionForm } from "@/features/app/admin/question-bank/utils/validatePaesQuestionForm";

export const createPaesQuestion = async (formData: FormData) => {
  try {
    const validatedForm = validatePaesQuestionForm(formData);
    const supabase = await createAdminSubjectActionClient();
    await assertPaesSubject(supabase, validatedForm.subjectId);

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

    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        question_set_id: questionSet.id,
        question_text: validatedForm.questionText,
      })
      .select("id")
      .single();

    if (questionError) {
      throw new Error(questionError.message);
    }

    const { error: optionsError } = await supabase
      .from("question_options")
      .insert(
        validatedForm.options.map((option) => ({
          ...option,
          question_id: question.id,
        })),
      );

    if (optionsError) {
      await supabase.from("questions").delete().eq("id", question.id);
      throw new Error(optionsError.message);
    }

    return {
      success: true,
      message: "PAES question added successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to add PAES question",
      error:
        error instanceof Error
          ? error.message
          : "Unable to add PAES question",
    };
  }
};
