import type { ValidatedQuestionForm } from "@/features/app/admin/question-bank/utils/validateQuestionForm";

export type ValidatedPaesQuestionForm = Omit<
  ValidatedQuestionForm,
  "difficulty" | "gameType"
>;

export const validatePaesQuestionForm = (
  formData: FormData,
): ValidatedPaesQuestionForm => {
  const subjectId = Number(formData.get("subjectId"));
  const questionText = String(formData.get("questionText") ?? "").trim();
  const correctOptionSortOrder = Number(formData.get("correctOptionSortOrder"));
  const optionTexts = [1, 2, 3, 4].map((sortOrder) =>
    String(formData.get(`option${sortOrder}`) ?? "").trim(),
  );

  if (!Number.isInteger(subjectId) || subjectId <= 0) {
    throw new Error("A valid PAES Series subject is required");
  }

  if (!questionText) {
    throw new Error("Question is required");
  }

  if (questionText.length > 1000) {
    throw new Error("Question must not exceed 1000 characters");
  }

  if (optionTexts.some((optionText) => !optionText)) {
    throw new Error("All answer choices are required");
  }

  const normalizedOptionTexts = new Set(
    optionTexts.map((optionText) => optionText.toLocaleLowerCase()),
  );

  if (normalizedOptionTexts.size !== optionTexts.length) {
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
