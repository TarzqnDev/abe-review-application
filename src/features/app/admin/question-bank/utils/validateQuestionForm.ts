import {
  isQuestionBankDifficulty,
  isQuestionBankGameType,
  type QuestionBankDifficulty,
  type QuestionBankGameType,
} from "@/features/app/admin/question-bank/constants/questionBank";

export type ValidatedQuestionForm = {
  correctOptionSortOrder: number;
  difficulty: QuestionBankDifficulty;
  gameType: QuestionBankGameType;
  options: {
    is_correct: boolean;
    option_text: string;
    sort_order: number;
  }[];
  questionText: string;
  subjectId: number;
};

export const validateQuestionForm = (
  formData: FormData,
): ValidatedQuestionForm => {
  const subjectId = Number(formData.get("subjectId"));
  const gameType = String(formData.get("gameType") ?? "");
  const difficulty = String(formData.get("difficulty") ?? "");
  const questionText = String(formData.get("questionText") ?? "").trim();
  const correctOptionSortOrder = Number(formData.get("correctOptionSortOrder"));
  const optionTexts = [1, 2, 3, 4].map((sortOrder) =>
    String(formData.get(`option${sortOrder}`) ?? "").trim(),
  );

  if (!Number.isInteger(subjectId) || subjectId <= 0) {
    throw new Error("A valid subject is required");
  }

  if (!isQuestionBankGameType(gameType)) {
    throw new Error("A valid game type is required");
  }

  if (!isQuestionBankDifficulty(difficulty)) {
    throw new Error("A valid difficulty is required");
  }

  if (!questionText) {
    throw new Error("Question is required");
  }

  if (questionText.length > 1000) {
    throw new Error("Question must not exceed 1000 characters");
  }

  const missingOption = optionTexts.some((optionText) => !optionText);

  if (missingOption) {
    throw new Error("All answer choices are required");
  }

  const optionTextSet = new Set(
    optionTexts.map((optionText) => optionText.toLowerCase()),
  );

  if (optionTextSet.size !== optionTexts.length) {
    throw new Error("Answer choices must be unique");
  }

  if (
    !Number.isInteger(correctOptionSortOrder) ||
    correctOptionSortOrder < 1 ||
    correctOptionSortOrder > 4
  ) {
    throw new Error("A correct answer is required");
  }

  return {
    correctOptionSortOrder,
    difficulty,
    gameType,
    options: optionTexts.map((optionText, optionIndex) => {
      const sortOrder = optionIndex + 1;

      return {
        is_correct: sortOrder === correctOptionSortOrder,
        option_text: optionText,
        sort_order: sortOrder,
      };
    }),
    questionText,
    subjectId,
  };
};
