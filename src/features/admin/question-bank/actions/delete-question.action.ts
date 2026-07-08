"use server";

import { createAdminSubjectActionClient } from "@/features/admin/question-bank/utils/assertAdminSession";

type QuestionSetSubject = {
  subject_id: number;
};

type QuestionDeleteLookup = {
  id: number;
  question_sets: QuestionSetSubject | QuestionSetSubject[] | null;
};

export const deleteQuestion = async (formData: FormData) => {
  try {
    const questionId = Number(formData.get("questionId"));
    const subjectId = Number(formData.get("subjectId"));

    if (!Number.isInteger(questionId) || questionId <= 0) {
      throw new Error("A valid question is required");
    }

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      throw new Error("A valid subject is required");
    }

    const supabase = await createAdminSubjectActionClient();
    const { data, error: questionLookupError } = await supabase
      .from("questions")
      .select("id, question_sets!inner(subject_id)")
      .eq("id", questionId)
      .single();

    if (questionLookupError) {
      throw new Error(questionLookupError.message);
    }

    const question = data as QuestionDeleteLookup;
    const questionSet = Array.isArray(question.question_sets)
      ? question.question_sets[0]
      : question.question_sets;

    if (questionSet?.subject_id !== subjectId) {
      throw new Error("Question does not belong to the selected subject");
    }

    const { error: questionOptionsError } = await supabase
      .from("question_options")
      .delete()
      .eq("question_id", questionId);

    if (questionOptionsError) {
      throw new Error(questionOptionsError.message);
    }

    const { error: questionError } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (questionError) {
      throw new Error(questionError.message);
    }

    return {
      success: true,
      message: "Question deleted successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to delete question",
      error:
        error instanceof Error ? error.message : "Unable to delete question",
    };
  }
};
