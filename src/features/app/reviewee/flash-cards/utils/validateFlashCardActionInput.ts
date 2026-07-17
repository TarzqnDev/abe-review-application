import type {
  CreateFlashCardInput,
  UpdateFlashCardInput,
} from "@/features/app/reviewee/flash-cards/types/flashCard";

const MAX_QUESTION_LENGTH = 1000;
const MAX_ANSWER_LENGTH = 2000;

export const assertPositiveInteger = (value: number, fieldName: string) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`A valid ${fieldName} is required`);
  }
};

const validateText = (
  value: string,
  fieldName: string,
  maximumLength: number,
) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`);
  }

  if (normalizedValue.length > maximumLength) {
    throw new Error(
      `${fieldName} must be ${maximumLength.toLocaleString()} characters or fewer`,
    );
  }

  return normalizedValue;
};

export const validateCreateFlashCardInput = ({
  areaId,
  question,
  answer,
}: CreateFlashCardInput) => {
  assertPositiveInteger(areaId, "subject area");

  return {
    areaId,
    question: validateText(question, "Question", MAX_QUESTION_LENGTH),
    answer: validateText(answer, "Answer", MAX_ANSWER_LENGTH),
  };
};

export const validateUpdateFlashCardInput = ({
  cardId,
  question,
  answer,
}: UpdateFlashCardInput) => {
  assertPositiveInteger(cardId, "flash card");

  return {
    cardId,
    question: validateText(question, "Question", MAX_QUESTION_LENGTH),
    answer: validateText(answer, "Answer", MAX_ANSWER_LENGTH),
  };
};

export const getFlashCardActionError = (
  error: unknown,
  fallbackMessage: string,
) => {
  console.error(error);
  return error instanceof Error ? error.message : fallbackMessage;
};
