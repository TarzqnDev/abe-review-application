"use server";

import {
  createEmptyQuestionBankSummaries,
  isQuestionBankDifficulty,
  isQuestionBankGameType,
  type QuestionBankDifficulty,
  type QuestionBankGameType,
  type QuestionBankSummary,
} from "@/features/admin/question-bank/constants/questionBank";
import { createAdminSubjectActionClient } from "@/features/admin/question-bank/utils/assertAdminSession";

export type AdminQuestionOption = {
  id: number;
  is_correct: boolean;
  option_text: string;
  question_id: number;
  sort_order: number;
};

export type AdminQuestion = {
  created_at: string;
  id: number;
  question_options: AdminQuestionOption[];
  question_set_id: number;
  question_text: string;
  updated_at: string;
};

export type AdminQuestionSet = {
  created_at: string;
  difficulty: QuestionBankDifficulty;
  game_type: QuestionBankGameType;
  id: number;
  questions: AdminQuestion[];
  subject_id: number;
  updated_at: string;
};

export const fetchSubjectQuestionSets = async (subjectId: number) => {
  try {
    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      throw new Error("A valid subject is required");
    }

    const supabase = await createAdminSubjectActionClient();
    const { data, error } = await supabase
      .from("question_sets")
      .select(
        "id, subject_id, game_type, difficulty, created_at, updated_at, questions(id, question_set_id, question_text, created_at, updated_at, question_options(id, question_id, option_text, is_correct, sort_order))",
      )
      .eq("subject_id", subjectId)
      .order("id");

    if (error) {
      throw new Error(error.message);
    }

    const questionSets = ((data ?? []) as AdminQuestionSet[])
      .filter(
        (questionSet) =>
          isQuestionBankGameType(questionSet.game_type) &&
          isQuestionBankDifficulty(questionSet.difficulty),
      )
      .map((questionSet) => ({
        ...questionSet,
        questions: [...(questionSet.questions ?? [])]
          .map((question) => ({
            ...question,
            question_options: [...(question.question_options ?? [])].sort(
              (firstOption, secondOption) =>
                firstOption.sort_order - secondOption.sort_order,
            ),
          }))
          .sort(
            (firstQuestion, secondQuestion) =>
              firstQuestion.id - secondQuestion.id,
          ),
      }));

    const summaries = createEmptyQuestionBankSummaries().map((summary) => {
      const matchingQuestionSet = questionSets.find(
        (questionSet) =>
          questionSet.game_type === summary.gameType &&
          questionSet.difficulty === summary.difficulty,
      );

      return {
        ...summary,
        questionSetId: matchingQuestionSet?.id ?? null,
        questionCount: matchingQuestionSet?.questions.length ?? 0,
      } satisfies QuestionBankSummary;
    });

    return {
      success: true,
      questionSets,
      summaries,
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      questionSets: [] as AdminQuestionSet[],
      summaries: createEmptyQuestionBankSummaries(),
      error:
        error instanceof Error
          ? error.message
          : "Unable to fetch subject questions",
    };
  }
};
