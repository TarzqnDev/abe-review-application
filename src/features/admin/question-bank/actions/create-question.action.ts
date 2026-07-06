"use server";

import { createAdminSubjectActionClient } from "@/features/admin/question-bank/utils/assertAdminSession";
import { validateQuestionForm } from "@/features/admin/question-bank/utils/validateQuestionForm";

export const createQuestion = async (formData: FormData) => {
  try {
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

    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        hint: validatedForm.hint,
        question_set_id: questionSet.id,
        question_text: validatedForm.questionText,
        situation: validatedForm.situation,
        statement_a: validatedForm.statementA,
        statement_b: validatedForm.statementB,
      })
      .select("id")
      .single();

    if (questionError) {
      throw new Error(questionError.message);
    }

    const { error: questionOptionsError } = await supabase
      .from("question_options")
      .insert(
        validatedForm.options.map((option) => ({
          ...option,
          question_id: question.id,
        })),
      );

    if (questionOptionsError) {
      await supabase.from("questions").delete().eq("id", question.id);
      throw new Error(questionOptionsError.message);
    }

    return {
      success: true,
      message: "Question added successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to add question",
      error: error instanceof Error ? error.message : "Unable to add question",
    };
  }
};
