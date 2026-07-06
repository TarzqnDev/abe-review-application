import {
  isQuestionBankDifficulty,
  isQuestionBankGameType,
  type QuestionBankDifficulty,
  type QuestionBankGameType,
} from "@/features/admin/question-bank/constants/questionBank";

export type ValidatedQuestionForm = {
  correctOptionSortOrder: number;
  difficulty: QuestionBankDifficulty;
  gameType: QuestionBankGameType;
  hint: string | null;
  options: {
    is_correct: boolean;
    option_text: string;
    sort_order: number;
  }[];
  questionText: string | null;
  situation: string | null;
  statementA: string | null;
  statementB: string | null;
  subjectId: number;
};

export const validateQuestionForm = (
  formData: FormData,
): ValidatedQuestionForm => {
  const subjectId = Number(formData.get("subjectId"));
  const gameType = String(formData.get("gameType") ?? "");
  const difficulty = String(formData.get("difficulty") ?? "");
  const questionText = String(formData.get("questionText") ?? "").trim();
  const hint = String(formData.get("hint") ?? "").trim();
  const statementA = String(formData.get("statementA") ?? "").trim();
  const statementB = String(formData.get("statementB") ?? "").trim();
  const situation = String(formData.get("situation") ?? "").trim();
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

  if (gameType !== "AB-Solution" && !questionText) {
    throw new Error("Question is required");
  }

  if (questionText.length > 1000) {
    throw new Error("Question must not exceed 1000 characters");
  }

  if (hint.length > 500) {
    throw new Error("Hint must not exceed 500 characters");
  }

  if (statementA.length > 1000) {
    throw new Error("Statement A must not exceed 1000 characters");
  }

  if (statementB.length > 1000) {
    throw new Error("Statement B must not exceed 1000 characters");
  }

  if (situation.length > 1000) {
    throw new Error("Situation/Scenario must not exceed 1000 characters");
  }

  if (gameType === "AB-Solution" && (!statementA || !statementB)) {
    throw new Error("Statement A and Statement B are required");
  }

  if (gameType === "Situationship" && !situation) {
    throw new Error("Situation/Scenario is required");
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
    hint: gameType === "Guess the Word" ? hint || null : null,
    options: optionTexts.map((optionText, optionIndex) => {
      const sortOrder = optionIndex + 1;

      return {
        is_correct: sortOrder === correctOptionSortOrder,
        option_text: optionText,
        sort_order: sortOrder,
      };
    }),
    questionText: gameType === "AB-Solution" ? null : questionText,
    situation: gameType === "Situationship" ? situation : null,
    statementA: gameType === "AB-Solution" ? statementA : null,
    statementB: gameType === "AB-Solution" ? statementB : null,
    subjectId,
  };
};
